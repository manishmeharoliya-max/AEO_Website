const issuesToIllustrate = {
  starter: 1,
  growth: 2,
  authority: 4,
};

export function scoreScenario(result, planId) {
  const issues = result.checks
    .filter((check) => !check.passed && check.maxPoints > 0)
    .sort((a, b) => b.maxPoints - a.maxPoints)
    .slice(0, issuesToIllustrate[planId] || 0);
  const possiblePoints = issues.reduce((total, check) => total + check.maxPoints, 0);
  return {
    current: result.score,
    possible: Math.min(100, result.score + possiblePoints),
    issues,
  };
}
