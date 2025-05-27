import { Button } from "../../../components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const formSchemaLogin = z.object({
  matricula: z.string().min(1, "Campo Obrigatório").max(12, "Máximo 12 caracteres"),
  password: z.string().min(1, "Campo obrigatório"),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      matricula: "",
      password: "",
    },
  })
  const navigate = useNavigate();

  function onSubmit(values: z.infer<typeof formSchemaLogin>) {
    fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registration: values.matricula,
        password: values.password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          // Redireciona se matrícula não tiver 7 dígitos
          if (values.matricula.length !== 7) {
            navigate("/requisitar-horario");
          }
        } else {
          alert(data.message || "Matrícula ou senha inválida");
        }
      })
      .catch(() => {
        alert("Erro ao conectar ao servidor");
      })
  }

  return (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="matricula"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="w-full">
                            <Input placeholder="Matrícula" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="w-full">
                            <Input placeholder="Senha" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-center">
                      <Button type="submit" className="w-full text-white bg-green-700 hover:bg-green-800">Entrar</Button>
                    </div>
                  </form>
                </Form>
              
  )
}

