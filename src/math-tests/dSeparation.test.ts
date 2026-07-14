import { describe, it, expect } from 'vitest';
import { isDSeparated, descendants } from '../lib/math/dSeparation';

function dag(nodes: string[], edges: [string, string][]) {
  return { nodes, edges };
}

describe('dSeparation', () => {
  it('chain A->B->C: dependent unconditionally, independent given B', () => {
    const g = dag(['A', 'B', 'C'], [['A', 'B'], ['B', 'C']]);
    expect(isDSeparated(g, 'A', 'C', [])).toBe(false);
    expect(isDSeparated(g, 'A', 'C', ['B'])).toBe(true);
  });

  it('fork A<-B->C: dependent unconditionally, independent given B', () => {
    const g = dag(['A', 'B', 'C'], [['B', 'A'], ['B', 'C']]);
    expect(isDSeparated(g, 'A', 'C', [])).toBe(false);
    expect(isDSeparated(g, 'A', 'C', ['B'])).toBe(true);
  });

  it('collider A->B<-C: independent unconditionally, dependent given B', () => {
    const g = dag(['A', 'B', 'C'], [['A', 'B'], ['C', 'B']]);
    expect(isDSeparated(g, 'A', 'C', [])).toBe(true);
    expect(isDSeparated(g, 'A', 'C', ['B'])).toBe(false);
  });

  it('conditioning on a descendant of a collider unblocks the path', () => {
    // A -> B <- C, B -> D
    const g = dag(['A', 'B', 'C', 'D'], [['A', 'B'], ['C', 'B'], ['B', 'D']]);
    expect(isDSeparated(g, 'A', 'C', [])).toBe(true);
    expect(isDSeparated(g, 'A', 'C', ['D'])).toBe(false);
    expect(isDSeparated(g, 'A', 'C', ['B'])).toBe(false);
  });

  it('descendants set includes the node itself', () => {
    const g = dag(['A', 'B', 'C'], [['A', 'B'], ['B', 'C']]);
    expect(Array.from(descendants(g, 'B'))).toContain('B');
    expect(Array.from(descendants(g, 'B'))).toContain('C');
    expect(Array.from(descendants(g, 'A'))).toContain('C');
  });

  it('longer path with mixed structures', () => {
    // A -> B -> C <- D, C -> E
    const g = dag(
      ['A', 'B', 'C', 'D', 'E'],
      [['A', 'B'], ['B', 'C'], ['D', 'C'], ['C', 'E']],
    );
    // A and D are independent unconditionally (collider C blocks)
    expect(isDSeparated(g, 'A', 'D', [])).toBe(true);
    // Conditioning on C unblocks A-B-C-D
    expect(isDSeparated(g, 'A', 'D', ['C'])).toBe(false);
    // Conditioning on E (descendant of C) also unblocks
    expect(isDSeparated(g, 'A', 'D', ['E'])).toBe(false);
  });
});
