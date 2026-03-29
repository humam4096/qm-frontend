import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Calendar,
  Utensils,
  Hash,
  ChefHat,
  Clock,
  Package,
  Scale,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Contract } from '../types';

interface ContractDisplayProps {
  data: Contract | null;
}

export const ContractDisplay: React.FC<ContractDisplayProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!data) return null;
  const getMealTypeLabel = (mealType: string) => {
    switch (mealType) {
      case 'buffet':
        return t('contracts.buffet');
      case 'individual':
        return t('contracts.individual');
      default:
        return mealType;
    }
  };

  const getTimeWindowLabel = (label: string) => {
    const labelMap: Record<string, string> = {
      'breakfast': t('contracts.breakfast'),
      'lunch': t('contracts.lunch'),
      'dinner': t('contracts.dinner'),
      'snack': t('contracts.snack'),
    };
    return labelMap[label.toLowerCase()] || label;
  };

  const getTimeWindowConfig = (label: string) => {
    const configMap: Record<string, { color: string; bgColor: string; icon: string }> = {
      'breakfast': { 
        color: 'text-warning', 
        bgColor: 'bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20', 
        icon: '🌅' 
      },
      'lunch': { 
        color: 'text-primary', 
        bgColor: 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20', 
        icon: '☀️' 
      },
      'dinner': { 
        color: 'text-secondary', 
        bgColor: 'bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20', 
        icon: '🌙' 
      },
      'snack': { 
        color: 'text-info', 
        bgColor: 'bg-gradient-to-r from-info/10 to-info/5 border-info/20', 
        icon: '🍎' 
      },
    };
    return configMap[label.toLowerCase()] || { 
      color: 'text-muted-foreground', 
      bgColor: 'bg-gradient-to-r from-muted/50 to-muted/25 border-muted', 
      icon: '🍽️' 
    };
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl p-6 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="relative flex items-start gap-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded-2xl shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="flex gap-3 mb-4x flex-wrap">
              <Badge 
                variant={data.is_active ? 'default' : 'secondary'}
                className={cn(
                  "px-4 py-2 text-sm font-medium",
                  data.is_active 
                    ? "bg-success hover:bg-success/90 text-white shadow-lg" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {data.is_active ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" />{t('contracts.active')}</>
                ) : (
                  <><AlertCircle className="w-4 h-4 mr-2" />{t('contracts.draft')}</>
                )}
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-2 text-sm font-medium">
                <Utensils className="w-4 h-4 mr-2" />
                {getMealTypeLabel(data.meal_type)}
              </Badge>
            </div>
          </div>
          <p className="text-white/80 text-lg">
            {t('contracts.contractDetails')} • {new Date(data.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
          </p>
        </div>
      </div>
      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary mb-1">{t('contracts.kitchen')}</p>
                <p className="text-xl font-bold text-secondary">{data?.kitchen?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-warning mb-1">{t('contracts.serviceDates')}</p>
                <p className="text-3xl font-bold text-warning">{data.dates?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary mb-1">{t('contracts.totalMeals')}</p>
                <p className="text-3xl font-bold text-primary">{data.total_meals.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      {/* Kitchen Network */}
   
      {/* Service Schedule */}
      {data.dates && data.dates.length > 0 && (
        <Card className="border-0 shadow-xl bg-cardx">
          <CardContent className="space-y-8">
            {data.dates.map((date, dateIndex) => (
              <div key={date.id} className="relative">
                
                {/* Date Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {dateIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {new Date(date.service_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    {date.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{date.notes}</p>
                    )}
                  </div>
                </div>
                {/* Time Windows Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ml-16">
                  {date.time_windows.map((timeWindow) => {
                    const config = getTimeWindowConfig(timeWindow.label);
                    
                    return (
                      <Card key={timeWindow.id} className={cn("border-2 shadow-lg", config.bgColor)}>
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{config.icon}</span>
                            <div>
                              <h4 className={cn("font-semibold text-lg", config.color)}>
                                {getTimeWindowLabel(timeWindow.label)}
                              </h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {timeWindow.start_time} - {timeWindow.end_time}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {timeWindow.meals.map((meal, mealIndex) => (
                            <div key={meal.id} className="bg-card/70 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                              
                              {/* Meal Header */}
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {mealIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-success">{meal.name}</h5>
                                  {meal.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
                                  )}
                                </div>
                              </div>

                              <Separator className="my-3" />
                              {/* Ingredients Section */}
                              {meal.ingredients && meal.ingredients.length > 0 && (
                                <div className="mb-4">
                                  <h6 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-success" />
                                    {t('contracts.ingredients')}
                                  </h6>
                                  <div className="space-y-2">
                                    {meal.ingredients.map((ingredient) => (
                                      <div 
                                        key={ingredient.id} 
                                        className="flex items-center justify-between p-2 bg-success/5 rounded-lg border border-success/10"
                                      >
                                        <div className="flex-1">
                                          <span className="font-medium text-success text-sm">{ingredient.name}</span>
                                          {ingredient.notes && (
                                            <p className="text-xs text-muted-foreground mt-1">{ingredient.notes}</p>
                                          )}
                                        </div>
                                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                          {ingredient.quantity_required}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Weight Specifications */}
                              {meal.weight_specs && meal.weight_specs.length > 0 && (
                                <div>
                                  <h6 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-info" />
                                    {t('contracts.weightSpecs')}
                                  </h6>
                                  <div className="flex flex-wrap gap-2">
                                    {meal.weight_specs.map((spec) => (
                                      <Badge 
                                        key={spec.id} 
                                        className="bg-info/10 text-info border border-info/20 px-3 py-1 hover:text-white"
                                      >
                                        <Scale className="w-3 h-3 mr-1" />
                                        <span className="font-medium">{spec.title}:</span>
                                        <span className="ml-1">{spec.value} {spec.unit}</span>
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Connector Line */}
                {dateIndex < data.dates.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-primary/30 to-transparent"></div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
};