import { useMemo } from "react";
import type { ScoreWithGap } from "../types";

interface Props {
  scores: ScoreWithGap[];
}

const CATEGORY_COLORS = ["#E9EBD4", "#DDE8D9", "#DFE8E8", "#E9E0E8", "#F2E8D4", "#DCE8ED"];
const CENTER = 480;
const VIEW_SIZE = 960;
const PLOT_INNER_RADIUS = 138;
const PLOT_OUTER_RADIUS = 255;
const CATEGORY_INNER_RADIUS = 76;
const CATEGORY_OUTER_RADIUS = 125;
const CRITERION_RING_INNER_RADIUS = 270;
const CRITERION_RING_OUTER_RADIUS = 430;
const CRITERION_LABEL_RADIUS = 350;
const FONT = "Arial, Helvetica, sans-serif";

function polar(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

function annularSectorPath(innerRadius: number, outerRadius: number, start: number, end: number) {
  const p1 = polar(outerRadius, start);
  const p2 = polar(outerRadius, end);
  const p3 = polar(innerRadius, end);
  const p4 = polar(innerRadius, start);
  const largeArc = end - start > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

function wrapLabel(label: string, maxWidth: number, fontSize: number) {
  const maxCharacters = Math.max(5, Math.floor(maxWidth / (fontSize * 0.52)));
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function uprightRotation(angle: number) {
  const normalized = ((angle % 360) + 360) % 360;
  return normalized > 90 && normalized < 270 ? normalized + 180 : normalized;
}

export default function CircularRadarProfile({ scores }: Props) {
  const { slices, categoryBands } = useMemo(() => {
    const groups = Array.from(new Set(scores.map((score) => score.categoryName))).map((categoryName, index) => ({
      categoryName,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      items: scores.filter((score) => score.categoryName === categoryName),
    }));

    if (!scores.length) return { slices: [], categoryBands: [] };

    const categoryGap = Math.min(3, 18 / groups.length);
    const sliceAngle = (360 - categoryGap * groups.length) / scores.length;
    let cursor = 0;
    const nextSlices: {
      score: ScoreWithGap;
      angle: number;
      start: number;
      end: number;
      color: string;
    }[] = [];
    const nextBands: {
      categoryName: string;
      start: number;
      end: number;
      mid: number;
      color: string;
    }[] = [];

    groups.forEach(({ categoryName, color, items }) => {
      const start = cursor;
      items.forEach((score) => {
        nextSlices.push({
          score,
          angle: cursor + sliceAngle / 2,
          start: cursor + 0.2,
          end: cursor + sliceAngle - 0.2,
          color,
        });
        cursor += sliceAngle;
      });
      nextBands.push({ categoryName, start, end: cursor, mid: (start + cursor) / 2, color });
      cursor += categoryGap;
    });

    return { slices: nextSlices, categoryBands: nextBands };
  }, [scores]);

  if (!slices.length) return null;

  const scoreRadius = (score: number) =>
    PLOT_INNER_RADIUS + (score / 5) * (PLOT_OUTER_RADIUS - PLOT_INNER_RADIUS);

  const currentPoints = slices
    .map(({ score, angle }) => {
      const point = polar(scoreRadius(score.currentState), angle);
      return `${point.x},${point.y}`;
    })
    .join(" ");
  const targetPoints = slices
    .map(({ score, angle }) => {
      const point = polar(scoreRadius(score.targetState), angle);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Circular results profile</p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">Circular economy product development</h2>
          <p className="mt-1 text-sm text-gray-500">Each segment is one criterion, grouped by circularity category.</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600" aria-label="Chart legend">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#527BAA]" />
            Current (IST)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#5C9B70]" />
            Target (SOLL)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#E9EBD4] ring-1 ring-gray-400" />
            Category
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          role="img"
          aria-label={`Circular current and target assessment profile across ${slices.length} criteria`}
          className="mx-auto h-auto w-full min-w-[620px]"
          style={{ maxWidth: VIEW_SIZE, fontFamily: FONT }}
        >
          {slices.map(({ score, start, end, color }) => (
            <path
              key={`criterion-band-${score.criterionId}`}
              d={annularSectorPath(CRITERION_RING_INNER_RADIUS, CRITERION_RING_OUTER_RADIUS, start, end)}
              fill={color}
              stroke="#373737"
              strokeWidth="1.1"
            >
              <title>{`${score.criterionName} — ${score.categoryName}`}</title>
            </path>
          ))}

          {categoryBands.map(({ categoryName, start, end, mid, color }) => {
            const position = polar((CATEGORY_INNER_RADIUS + CATEGORY_OUTER_RADIUS) / 2, mid);
            const categoryLabelFontSize = 8.5;
            const categoryLines = wrapLabel(categoryName, CATEGORY_OUTER_RADIUS - CATEGORY_INNER_RADIUS - 8, categoryLabelFontSize);
            return (
              <g key={`category-${categoryName}`}>
                <path
                  d={annularSectorPath(CATEGORY_INNER_RADIUS, CATEGORY_OUTER_RADIUS, start, end)}
                  fill={color}
                  stroke="#474747"
                  strokeWidth="1.1"
                />
                <text
                  x={position.x}
                  y={position.y}
                  transform={`rotate(${uprightRotation(mid)} ${position.x} ${position.y})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={categoryLabelFontSize}
                  fontWeight="700"
                  fill="#252525"
                >
                  {categoryLines.map((line, index) => (
                    <tspan
                      key={`${categoryName}-line-${index}`}
                      x={position.x}
                      dy={index === 0 ? -((categoryLines.length - 1) * categoryLabelFontSize * 0.55) : categoryLabelFontSize * 1.1}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {[1, 2, 3, 4, 5].map((rating) => {
            const radius = scoreRadius(rating);
            return (
              <g key={`grid-${rating}`}>
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  fill="none"
                  stroke="#575757"
                  strokeWidth={rating === 5 ? 1.1 : 0.8}
                />
                <text x={CENTER + 4} y={CENTER - radius + 10} fontSize="9" fill="#494949">
                  {rating}
                </text>
              </g>
            );
          })}

          {slices.map(({ score, angle }) => {
            const start = polar(PLOT_INNER_RADIUS, angle);
            const end = polar(PLOT_OUTER_RADIUS, angle);
            return (
              <line
                key={`axis-${score.criterionId}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#B4B4B4"
                strokeWidth="0.65"
              />
            );
          })}

          <polygon
            points={targetPoints}
            fill="rgba(143, 203, 166, 0.18)"
            stroke="#5C9B70"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            strokeLinejoin="round"
          />
          <polygon
            points={currentPoints}
            fill="rgba(127, 163, 206, 0.26)"
            stroke="#527BAA"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {slices.map(({ score, angle }) => {
            const current = polar(scoreRadius(score.currentState), angle);
            const target = polar(scoreRadius(score.targetState), angle);
            return (
              <g key={`ratings-${score.criterionId}`}>
                <circle cx={target.x} cy={target.y} r="2.5" fill="#5C9B70">
                  <title>{`${score.criterionName}: target ${score.targetState} of 5`}</title>
                </circle>
                <circle cx={current.x} cy={current.y} r="2.8" fill="#344F6D">
                  <title>{`${score.criterionName}: current ${score.currentState} of 5`}</title>
                </circle>
              </g>
            );
          })}

          <circle cx={CENTER} cy={CENTER} r="68" fill="#fff" stroke="#555" strokeWidth="1.2" />
          <text
            x={CENTER}
            y={CENTER - 9}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#252525"
          >
            Circular Economy
          </text>
          <text x={CENTER} y={CENTER + 7} textAnchor="middle" fontSize="10" fontWeight="700" fill="#252525">
            Product Development
          </text>

          {slices.map(({ score, angle }) => {
            const position = polar(CRITERION_LABEL_RADIUS, angle);
            const labelFontSize = slices.length > 32 ? 7 : slices.length > 22 ? 7.5 : 8.5;
            const arcWidth = 2 * CRITERION_LABEL_RADIUS * Math.tan(Math.PI / slices.length) * 0.82;
            const lines = wrapLabel(score.criterionName, arcWidth, labelFontSize);
            const rotation = uprightRotation(angle - 90);

            return (
              <text
                key={`label-${score.criterionId}`}
                x={position.x}
                y={position.y}
                transform={`rotate(${rotation} ${position.x} ${position.y})`}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={labelFontSize}
                fill="#222"
                pointerEvents="auto"
              >
                <title>{`${score.criterionName} — ${score.categoryName}; current ${score.currentState}, target ${score.targetState}`}</title>
                {lines.map((line, index) => (
                  <tspan key={`${score.criterionId}-line-${index}`} x={position.x} dy={index === 0 ? 0 : labelFontSize * 1.05}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        Rating scale: 1 (inner ring) to 5 (outer ring). Hover a point or criterion label for details.
      </p>
    </section>
  );
}
