import { describe, it, expect } from 'vitest';
import {
  convParams,
  locallyConnectedParams,
  denseParams,
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

  it('locallyConnectedParams / convParams equals Hout*Wout', () => {
    const cases = [
      { Hout: 6, Wout: 6, Kh: 3, Kw: 3, Cin: 1, Cout: 1 },
      { Hout: 14, Wout: 14, Kh: 3, Kw: 3, Cin: 3, Cout: 8 },
      { Hout: 7, Wout: 7, Kh: 5, Kw: 5, Cin: 64, Cout: 128 },
    ];
    for (const c of cases) {
      const local = locallyConnectedParams(
        c.Hout,
        c.Wout,
        c.Kh,
        c.Kw,
        c.Cin,
        c.Cout,
      );
      const conv = convParams(c.Kh, c.Kw, c.Cin, c.Cout);
      expect(local).toBe(c.Hout * c.Wout * conv);
      expect(local / conv).toBeCloseTo(c.Hout * c.Wout, 10);
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

  it('connectionCount is independent of sharing scheme', () => {
    const Hin = 8;
    const Win = 8;
    const Cin = 3;
    const Hout = 6;
    const Wout = 6;
    const Cout = 8;
    const Kh = 3;
    const Kw = 3;

    const connections = connectionCount(
      Hin,
      Win,
      Cin,
      Hout,
      Wout,
      Cout,
      Kh,
      Kw,
    );

    // Each output unit connects to Kh*Kw*Cin input units.
    const perOutput = Kh * Kw * Cin;
    const outputs = Hout * Wout * Cout;
    expect(connections).toBe(perOutput * outputs);

    // Same value for convolution, locally-connected, or dense semantics.
    expect(connections).toBe(
      Hout * Wout * Cout * Kh * Kw * Cin,
    );
  });
});
