import {
  Card,
  CardContent,
  CardFooter,
} from "../../components/ui/card"

import loginImg from "../../assets/login.jpeg";
import { LoginForm } from "./components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-green-900" /* div1: tela inteira, fundo externo verde escuro */>
      {/* Lousa (retângulo central) */}
      <div className="w-[90vw] h-[80vh] max-w-none flex shadow-2xl rounded-2xl overflow-hidden bg-[] ">
        {/* div2: lado esquerdo, form de login */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-login md:bg-none md:bg-[#bddae2]">
          <div className="absolute inset-0 bg-black/40 z-0 md:hidden" />
          <div className="relative z-10 w-full flex flex-col items-center justify-center">
            <h1 className="text-4xl text-white font-bold mb-20 md:text-6xl">MONITORA+</h1>
            <Card className="w-full max-w-md bg-white/80 shadow-none border-none mb-30">
              <CardContent>
              <LoginForm/>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </div>
        {/* div3: lado direito, imagem grande */}
        <div className="hidden md:flex w-2/3 h-full items-center justify-center ">
          <img src={loginImg} alt="Login" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  )
}

