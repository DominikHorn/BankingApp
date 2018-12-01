export interface IPoint {
    // Cordinates of the point
    x: number;
    y: number;
}

export interface ITrendLine {
    // Slope
    slope: number;
    // Y offset
    yOffset: number;
}

/** linear Trendline implementation according to
 * https://classroom.synonym.com/calculate-trendline-2709.html
 */
export function calculateTrendLine(points: IPoint[]): ITrendLine {
    let a = .0;
    let c = .0;
    let xSum = .0;
    let ySum = .0;

    for (const point of points) {
        a += point.x * point.y;
        c += point.x * point.x;
        xSum += point.x;
        ySum += point.y;
    }

    // Calculate slope
    a *= points.length;
    c *= points.length;
    const b = xSum * ySum;
    const d = xSum * xSum;
    const slope = (a - b) / (c - d);

    // Calculate yOffset
    const e = ySum;
    const f = slope * xSum;
    const yOffset = (e - f) / points.length;

    return {
        slope,
        yOffset,
    };
}