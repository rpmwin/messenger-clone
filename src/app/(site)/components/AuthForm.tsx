// import React from 'react'
"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
// import { Varela } from "next/font/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

type Variant = "login" | "register";

function AuthForm() {
    const [variant, setVariant] = useState<Variant>("login");
    const [loading, setLoading] = useState(false);

    const toggleVariant = useCallback(() => {
        if (variant === "login") {
            setVariant("register");
        } else {
            setVariant("login");
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true);

        if (variant === "register") {
            // Axios registration

            const response: any = await axios
                .post("/api/register", data)
                .catch((error) => {
                    toast.error("Something went wrong!");
                });

            if (response.status === 200) {
                // NextAuth login
                // console.log(response.status);
                toast.success("Success!");
            }
        } else {
            // NextAuth login
            // console.log(data);
            signIn("credentials", {
                ...data,
                redirect: false,
            }).then((response) => {
                if (response?.error) {
                    toast.error("Invalid credentials");
                }

                if (response?.ok && !response?.error) {
                    toast.success("Success!");
                }
            });
        }

        setLoading(false);
    };

    const socialAction = (action: string) => {
        setLoading(true);

        // NextAuth social login

        signIn(action, {
            redirect: false,
        })
            .then((response) => {
                if (response?.error) {
                    toast.error("Invalid credentials");
                }

                if (response?.ok && !response?.error) {
                    toast.success("Success!");
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div
            className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
        "
        >
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                    action="#"
                    method="POST"
                >
                    {variant === "register" && (
                        <Input
                            label="Name"
                            id="name"
                            type="name"
                            register={register}
                            errors={errors}
                            required
                        />
                    )}

                    <Input
                        label="Email"
                        id="email"
                        register={register}
                        errors={errors}
                        required
                    />

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        register={register}
                        errors={errors}
                        required
                    />

                    <div>
                        <Button disabled={loading} fullWidth type="submit">
                            {variant === "login" ? "Sign In" : "Register"}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction("github")}
                        />

                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction("google")}
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </div>
                    <div
                        onClick={toggleVariant}
                        className="underline cursor-pointer"
                    >
                        {variant === "login" ? "Create an account" : "Login"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;
