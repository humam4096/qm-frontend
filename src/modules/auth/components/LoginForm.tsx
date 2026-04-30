import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ShieldCheck } from "lucide-react"
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/app/store/useAuthStore"
import { ROLE_BASE_ROUTES } from "@/app/router/routeConfig"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      await login(data.email, data.password);
      
      const state = useAuthStore.getState();
      if (state.user?.role) {
         toast.success(t('auth.loginSuccess', 'Successfully logged in'));
         navigate(ROLE_BASE_ROUTES[state.user.role]);
      } else {
         // Fallback if role somehow isn't strictly recognized immediately
         navigate("/");
      }

    } catch (err) {
      // The error is already saved in `authError` state by the store
      // But we prevent the unhandled promise rejection here
      console.log(err)
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border shadow-2xl backdrop-blur-sm bg-card/95 relative">
        {/* Premium card decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full" />
        
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardContent className="p-0 relative">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10">
            <FieldGroup>
              <div className="flex flex-col items-center gap-3 text-center mb-2">
                {/* Premium icon badge */}
                <div className="relative mb-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-md opacity-50" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {t('auth.title', 'Welcome back')}
                </h1>
                <p className="text-balance text-muted-foreground text-base">
                  {t('auth.subtitle', 'Login to your account')}
                </p>
              </div>

              {authError && (
                <div className="p-4 mt-4 text-sm font-medium rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-center backdrop-blur-sm">
                  {authError}
                </div>
              )}
              
              <Field>
                <FieldLabel htmlFor="email" className="text-sm font-semibold">
                  {t('auth.email', 'Email')}
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@system.com"
                  className={cn(
                    "h-11 transition-all duration-200",
                    errors.email 
                      ? "border-destructive focus-visible:ring-destructive" 
                      : "focus-visible:ring-primary/20 focus-visible:border-primary"
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-sm font-semibold">
                    {t('auth.password', 'Password')}
                  </FieldLabel>
                  <a
                    href="#"
                    className="text-sm font-medium underline-offset-4 hover:underline text-primary transition-colors"
                  >
                    {t('auth.forgotPassword', 'Forgot your password?')}
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  className={cn(
                    "h-11 transition-all duration-200",
                    errors.password 
                      ? "border-destructive focus-visible:ring-destructive" 
                      : "focus-visible:ring-primary/20 focus-visible:border-primary"
                  )}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-destructive mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-11 font-semibold text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-inherit border-t-transparent" />
                       {t('common.loading', 'Loading...')}
                    </span>
                  ) : t('common.login', 'Login')}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="hidden px-6 text-center text-sm">
        {t('auth.noAccount', "Don't have an account?")}{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          {t('auth.signup', "Sign up")}
        </Link>
      </FieldDescription>
    </div>
  )
}
