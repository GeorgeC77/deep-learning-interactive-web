import { describe, it, expect } from 'vitest';
import {
  convParams,
  convWeightParams,
  convConnectionCount,
  locallyConnectedParams,
  locallyConnectedWeightParams,
  locallyConnectedConnectionCount,
  denseParams,
  denseBiasParams,
  denseConnectionCount,
  connectionCount,
} from '../lib/math/parameterSharing';

describe('parameterSharing', () => {
  it('convParams equals Kh*Kw*Cin*Cout + Cout', () => {
    const cases = [
      { Kh: 3, Kw: 3, Cin: 1, Cout: 1 },
      { Kh: 3, Kw: 3, Cin: 3, Cout: 16 },
      { Kh: 5, Kw: 5, Cin: 64, Cout: 128 },
      { Kh: 1, Kw: 1, Cin: 512, Cout: 512 },
    ];
    for (const { Kh, Kw, Cin, Cout } of cases) {
      expect(convParams(Kh, Kw, Cin, Cout)).toBe(Kh * Kw * Cin * Cout + Cout);
    }
  });

  it('locallyConnectedParams / conv weight params equals Hout*Wout', () => {
    const cases = [
      { Hout: 6, Wout: 6, Kh: 3, Kw: 3, Cin: 1, Cout: 1 },
      { Hout: 14, Wout: 14, Kh: 3, Kw: 3, Cin: 3, Cout: 8 },
      { Hout: 7, Wout: 7, Kh: 5, Kw: 5, Cin: 64, Cout: 128 },
    ];
    for (const c of cases) {
      const localWeights = locallyConnectedWeightParams(
        c.Hout,
        c.Wout,
        c.Kh,
        c.Kw,
        c.Cin,
        c.Cout,
      );
      const convWeights = convWeightParams(c.Kh, c.Kw, c.Cin, c.Cout);
      expect(localWeights).toBe(c.Hout * c.Wout * convWeights);
    }
  });

  it('denseParams is greater than locallyConnectedParams for typical sizes', () => {
    const cases = [
      { Hin: 8, Win: 8, Cin: 1, Hout: 6, Wout: 6, Cout: 1, Kh: 3, Kw: 3 },
      { Hin: 32, Win: 32, Cin: 3, Hout: 28, Wout: 28, Cout: 16, Kh: 5, Kw: 5 },
      { Hin: 16, Win: 16, Cin: 8, Hout: 14, Wout: 14, Cout: 8, Kh: 3, Kw: 3 },
    ];
    for (const c of cases) {
      expect(
        denseParams(c.Hin, c.Win, c.Cin, c.Hout, c.Wout, c.Cout),
      ).toBeGreaterThan(
        locallyConnectedParams(c.Hout, c.Wout, c.Kh, c.Kw, c.Cin, c.Cout),
      );
    }
  });

  it('conv and locally-connected layers have the same connection count', () => {
    const cases = [
      { Hout: 6, Wout: 6, Kh: 3, Kw: 3, Cin: 1, Cout: 1 },
      { Hout: 14, Wout: 14, Kh: 3, Kw: 3, Cin: 3, Cout: 8 },
      { Hout: 7, Wout: 7, Kh: 5, Kw: 5, Cin: 64, Cout: 128 },
    ];
    for (const c of cases) {
      expect(convConnectionCount(c.Hout, c.Wout, c.Cout, c.Kh, c.Kw, c.Cin)).toBe(
        locallyConnectedConnectionCount(c.Hout, c.Wout, c.Cout, c.Kh, c.Kw, c.Cin),
      );
    }
  });

  it('dense connections use the full flattened input dimension', () => {
    const Hin = 8;
    const Win = 8;
    const Cin = 3;
    const Hout = 6;
    const Wout = 6;
    const Cout = 8;
    const Kh = 3;
    const Kw = 3;

    const denseConn = denseConnectionCount(Hin, Win, Cin, Hout, Wout, Cout);
    const localConn = locallyConnectedConnectionCount(Hout, Wout, Cout, Kh, Kw, Cin);

    expect(denseConn).toBe(Hin * Win * Cin * Hout * Wout * Cout);
    expect(denseConn).toBeGreaterThan(localConn);
  });

  it('dense total params never exceed dense connections plus biases', () => {
    const Hin = 8;
    const Win = 8;
    const Cin = 3;
    const Hout = 6;
    const Wout = 6;
    const Cout = 8;

    const params = denseParams(Hin, Win, Cin, Hout, Wout, Cout);
    const conns = denseConnectionCount(Hin, Win, Cin, Hout, Wout, Cout);
    const biases = denseBiasParams(Hout, Wout, Cout);
    expect(params).toBe(conns + biases);
    expect(params).toBeLessThanOrEqual(conns + biases);
  });

  it('changing kernel size affects local/conv connections but not dense connections', () => {
    const Hin = 10;
    const Win = 10;
    const Cin = 2;
    const Hout = 8;
    const Wout = 8;
    const Cout = 4;

    const denseConn3 = denseConnectionCount(Hin, Win, Cin, Hout, Wout, Cout);
    const denseConn5 = denseConnectionCount(Hin, Win, Cin, Hout, Wout, Cout);
    expect(denseConn3).toBe(denseConn5);

    const localConn3 = locallyConnectedConnectionCount(Hout, Wout, Cout, 3, 3, Cin);
    const localConn5 = locallyConnectedConnectionCount(Hout, Wout, Cout, 5, 5, Cin);
    expect(localConn5).toBeGreaterThan(localConn3);
  });

  it('connectionCount backward-compatible formula matches local/conv wiring', () => {
    const Hin = 8;
    const Win = 8;
    const Cin = 3;
    const Hout = 6;
    const Wout = 6;
    const Cout = 8;
    const Kh = 3;
    const Kw = 3;

    expect(connectionCount(Hin, Win, Cin, Hout, Wout, Cout, Kh, Kw)).toBe(
      convConnectionCount(Hout, Wout, Cout, Kh, Kw, Cin),
    );
  });
});
