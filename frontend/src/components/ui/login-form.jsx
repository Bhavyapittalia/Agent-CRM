import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ user, handleChange, handleLogin }) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} autoComplete="off">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  autoComplete="off"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Input
                  id="password"
                  autoComplete="off"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Field>

              <Field>
                <Button className="w-full bg-gray-500" type="submit">
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}