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
      <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-secondary rounded-2xl p-4 md:p-6 text-white shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent"></div>
        <div className="relative flex flex-col md:flex-row items-start gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded-2xl shadow-lg shrink-0">
            <FileText className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold truncate">{data.name}</h1>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 shrink-0" />
            </div>
            <div className="flex gap-2 md:gap-3 mb-2 md:mb-4 flex-wrap">
              <Badge 
                variant={data.is_active ? 'default' : 'secondary'}
                className={cn(
                  "px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium",
                  data.is_active 
                    ? "bg-success hover:bg-success/90 text-white shadow-lg" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {data.is_active ? (
                  <><CheckCircle2 className={cn("w-3 h-3 md:w-4 md:h-4", isRTL ? "ml-1 md:ml-2" : "mr-1 md:mr-2")} />{t('contracts.active')}</>
                ) : (
                  <><AlertCircle className={cn("w-3 h-3 md:w-4 md:h-4", isRTL ? "ml-1 md:ml-2" : "mr-1 md:mr-2")} />{t('contracts.draft')}</>
                )}
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium">
                <Utensils className={cn("w-3 h-3 md:w-4 md:h-4", isRTL ? "ml-1 md:ml-2" : "mr-1 md:mr-2")} />
                {getMealTypeLabel(data.meal_type)}
              </Badge>
            </div>
          </div>
          <div className={cn("text-white/80 text-sm md:text-lg shrink-0", isRTL ? "text-center md:text-left" : "text-center md:text-right")}>
            <p className="hidden md:block">
              {t('contracts.contractDetails')} • {new Date(data.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
            </p>
            <p className="md:hidden text-xs">
              {new Date(data.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>
      </div>
      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                <ChefHat className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-xs md:text-sm font-medium text-secondary mb-1">{t('contracts.kitchen')}</p>
                <p className="text-lg md:text-xl font-bold text-secondary truncate">{data?.kitchen?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-warning/5 to-warning/10">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-warning rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className='flex flex-col items-start'>
                <p className="text-xs md:text-sm font-medium text-warning mb-1">{t('contracts.serviceDates')}</p>
                <p className="text-2xl md:text-3xl font-bold text-warning">{data.dates?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-primary/5 to-primary/10 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className='flex flex-col items-start'>
                <p className="text-xs md:text-sm font-medium text-primary mb-1">{t('contracts.totalMeals')}</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">{data.total_meals.toLocaleString()}</p>
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
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm md:text-lg shrink-0">
                    {dateIndex + 1}
                  </div>
                  <div className="min-w-0 flex-1x">
                    <h3 className="text-base md:text-lg font-semibold text-foreground">
                      {new Date(date.service_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    {date.notes && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">{date.notes}</p>
                    )}
                  </div>
                </div>
                {/* Time Windows Grid */}
                <div className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6",
                  isRTL ? "mr-6 md:mr-10 lg:mr-16" : "ml-6 md:ml-10 lg:ml-16"
                )}>
                  {date.time_windows.map((timeWindow) => {
                    const config = getTimeWindowConfig(timeWindow.label);
                    
                    return (
                      <Card key={timeWindow.id} className={cn("border-2 shadow-lg", config.bgColor)}>
                        <CardHeader className="pb-3 md:pb-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl">{config.icon}</span>
                            <div className="flex flex-col items-start min-w-0 flex-1">
                              <h4 className={cn("font-semibold text-base md:text-lg", config.color)}>
                                {getTimeWindowLabel(timeWindow.label)}
                              </h4>
                              <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                <span className={isRTL ? "mr-1" : "ml-1"}>
                                    {`${t('contracts.timeDisplay.from')} ${new Date(timeWindow.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                    ${t('contracts.timeDisplay.to')} ${new Date(timeWindow.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                </span>
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 md:space-y-4">
                          {timeWindow.meals.map((meal, mealIndex) => (
                            <div key={meal.id} className="bg-card/70 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-border/50">
                              
                              {/* Meal Header */}
                              <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-success rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm shrink-0">
                                  {mealIndex + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-sm md:text-base text-success">{meal.name}</h5>
                                  {meal.description && (
                                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{meal.description}</p>
                                  )}
                                </div>
                              </div>

                              <Separator className="my-2 md:my-3" />
                              {/* Ingredients Section */}
                              {meal.ingredients && meal.ingredients.length > 0 && (
                                <div className="mb-3 md:mb-4">
                                  <h6 className="font-medium text-xs md:text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                    <Package className="w-3 h-3 md:w-4 md:h-4 text-success" />
                                    <span>{t('contracts.ingredients')}</span>
                                  </h6>
                                  <div className="space-y-2">
                                    {meal.ingredients.map((ingredient) => (
                                      <div 
                                        key={ingredient.id} 
                                        className="flex items-center justify-between p-2 bg-success/5 rounded-lg border border-success/10 gap-2"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <span className="font-medium text-success text-xs md:text-sm block truncate">{ingredient.name}</span>
                                          {ingredient.notes && (
                                            <p className="text-xs text-muted-foreground mt-1">{ingredient.notes}</p>
                                          )}
                                        </div>
                                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs shrink-0">
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
                                  <h6 className="font-medium text-xs md:text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                    <Scale className="w-3 h-3 md:w-4 md:h-4 text-info" />
                                    <span>{t('contracts.weightSpecs')}</span>
                                  </h6>
                                  <div className="flex flex-wrap gap-2">
                                    {meal.weight_specs.map((spec) => (
                                      <Badge 
                                        key={spec.id} 
                                        className="bg-info/10 text-info border border-info/20 px-2 md:px-3 py-1 hover:text-white text-xs"
                                      >
                                        <Scale className={cn("w-3 h-3", isRTL ? "ml-1" : "mr-1")} />
                                        <span className="font-medium">{spec.title}:</span>
                                        <span className={cn(isRTL ? "mr-1" : "ml-1")}>{spec.value} {spec.unit}</span>
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
                  <div className={cn(
                    "absolute top-20 w-0.5 h-16 bg-linear-to-b from-primary/30 to-transparent",
                    isRTL ? "right-4 md:right-6" : "left-4 md:left-6"
                  )}></div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
};