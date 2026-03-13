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
      <Card className="overflow-hidden p-0 shadow-sm border-border">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">{t('auth.title', 'Welcome back')}</h1>
                <p className="text-balance text-muted-foreground">
                  {t('auth.subtitle', 'Login to your account')}
                </p>
              </div>

              {authError && (
                <div className="p-3 mt-4 text-sm font-medium rounded-md bg-destructive/15 text-destructive border border-destructive/20 text-center">
                  {authError}
                </div>
              )}
              
              <Field>
                <FieldLabel htmlFor="email">{t('auth.email', 'Email')}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@system.com"
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive mt-1">{errors.email.message}</p>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">{t('auth.password', 'Password')}</FieldLabel>
                  <a
                    href="#"
                    className="text-sm font-medium underline-offset-4 hover:underline text-primary"
                  >
                    {t('auth.forgotPassword', 'Forgot your password?')}
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-destructive mt-1">{errors.password.message}</p>
                )}
              </Field>

              <Field className="pt-2">
                <Button type="submit" className="w-full font-semibold" disabled={isSubmitting}>
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
      <FieldDescription className="px-6 text-center text-sm">
        {t('auth.noAccount', "Don't have an account?")}{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          {t('auth.signup', "Sign up")}
        </Link>
      </FieldDescription>
    </div>
  )
}
