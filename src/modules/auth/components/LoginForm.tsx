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
import { useAuthStore, type UserRole } from "@/app/store/useAuthStore"
import { ROLE_BASE_ROUTES } from "@/app/router/routeConfig"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.custom<UserRole>(),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const login = useAuthStore((state) => state.login);
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
      role: "SystemManager",
    },
  });

  const onSubmit = (data: LoginValues) => {
    // Hardcoded mock user for development testing of the guards
    login({
      id: 'mock-123',
      name: 'Test Administrator',
      email: data.email,
      role: data.role,
    });

    // Send them to their correct dashboard
    navigate(ROLE_BASE_ROUTES[data.role]);
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
              
              <Field>
                <FieldLabel htmlFor="email">{t('auth.email', 'Email')}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
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

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground block rtl:text-right">
                  {t('auth.mockLoginLabel', 'Choose role')}
                </label>
                <select 
                  className="w-full bg-background border border-input text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-input block px-4 py-2.5 transition-colors shadow-sm"
                  {...register("role")}
                >
                  <option value="SystemManager">System Manager</option>
                  <option value="CateringManager">Catering Manager (Branch)</option>
                  <option value="ProjectManager">Operations/Project Manager</option>
                  <option value="QualityManager">Quality Manager</option>
                  <option value="QualitySupervisor">Quality Supervisor (Zone)</option>
                  <option value="QualityInspector">Quality Inspector (Field)</option>
                </select>
              </div>

              <Field className="pt-2">
                <Button type="submit" className="w-full font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? t('common.loading', 'Loading...') : t('common.login', 'Login')}
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
