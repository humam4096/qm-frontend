/**
 * Dashboard Metrics & Health Score Utilities
 * Simple calculations for operational intelligence
 */

export type HealthStatus = 'Critical' | 'At Risk' | 'Stable' | 'Good';
export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type MetricStatus = 'red' | 'orange' | 'green';

/**
 * Calculate overall operational health score (0-100)
 */
export function calculateHealthScore(params: {
  avgScore: number;
  successRate: number;
  completionRate: number;
  rejectionRate: number;
}): number {
  const { avgScore, successRate, completionRate, rejectionRate } = params;
  
  // Weighted calculation
  const scoreWeight = 0.4;
  const successWeight = 0.3;
  const completionWeight = 0.2;
  const rejectionPenalty = 0.1;
  
  const normalizedScore = avgScore; // already 0-100
  const normalizedSuccess = successRate * 100;
  const normalizedCompletion = completionRate * 100;
  const normalizedRejection = (1 - rejectionRate) * 100;
  
  const health = 
    (normalizedScore * scoreWeight) +
    (normalizedSuccess * successWeight) +
    (normalizedCompletion * completionWeight) +
    (normalizedRejection * rejectionPenalty);
  
  return Math.round(Math.max(0, Math.min(100, health)));
}

/**
 * Classify health status based on score
 */
export function getHealthStatus(score: number): HealthStatus {
  if (score >= 85) return 'Good';
  if (score >= 70) return 'Stable';
  if (score >= 50) return 'At Risk';
  return 'Critical';
}

/**
 * Get health status color classes
 */
export function getHealthStatusColor(status: HealthStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'Good':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-300 dark:border-emerald-700',
        dot: 'bg-emerald-500',
      };
    case 'Stable':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-300 dark:border-blue-700',
        dot: 'bg-blue-500',
      };
    case 'At Risk':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-300 dark:border-amber-700',
        dot: 'bg-amber-500',
      };
    case 'Critical':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/20',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-300 dark:border-rose-700',
        dot: 'bg-rose-500',
      };
  }
}

/**
 * Determine issue severity
 */
export function getIssueSeverity(params: {
  type: 'missing_submission' | 'pending_approval' | 'rejection' | 'low_score' | 'empty_window' | 'bottleneck';
  value?: number;
}): IssueSeverity {
  const { type, value = 0 } = params;
  
  switch (type) {
    case 'missing_submission':
      return value > 10 ? 'Critical' : value > 5 ? 'High' : 'Medium';
    case 'empty_window':
      return 'Critical';
    case 'low_score':
      return value < 50 ? 'Critical' : value < 70 ? 'High' : 'Medium';
    case 'rejection':
      return 'High';
    case 'pending_approval':
      return value > 10 ? 'High' : 'Medium';
    case 'bottleneck':
      return 'Medium';
    default:
      return 'Low';
  }
}

/**
 * Get severity color classes
 */
export function getSeverityColor(severity: IssueSeverity): {
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/20',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-300 dark:border-rose-700',
      };
    case 'High':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-300 dark:border-orange-700',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-300 dark:border-amber-700',
      };
    case 'Low':
      return {
        bg: 'bg-slate-50 dark:bg-slate-950/20',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-300 dark:border-slate-700',
      };
  }
}

/**
 * Get metric status based on value vs target
 */
export function getMetricStatus(value: number, target: number, inverse = false): MetricStatus {
  const ratio = value / target;
  
  if (inverse) {
    // For metrics where lower is better (e.g., rejection rate)
    if (ratio <= 0.5) return 'green';
    if (ratio <= 0.8) return 'orange';
    return 'red';
  }
  
  // For metrics where higher is better
  if (ratio >= 0.95) return 'green';
  if (ratio >= 0.8) return 'orange';
  return 'red';
}

/**
 * Get metric status color
 */
export function getMetricStatusColor(status: MetricStatus): string {
  switch (status) {
    case 'green':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'orange':
      return 'text-amber-600 dark:text-amber-400';
    case 'red':
      return 'text-rose-600 dark:text-rose-400';
  }
}

/**
 * Format percentage
 */
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

/**
 * Get trend indicator (simplified - would need historical data for real trends)
 */
export function getTrendIndicator(current: number, threshold: number): 'up' | 'down' | 'stable' {
  if (current > threshold * 1.1) return 'up';
  if (current < threshold * 0.9) return 'down';
  return 'stable';
}
