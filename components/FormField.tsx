import React, { useState } from 'react'
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller, FieldValues, Path, Control } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file';
}

const FormField = <T extends FieldValues>({ control, name, placeholder, type = "text" }: FormFieldProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div className="relative">
                            <Input
                                className="input pr-10"
                                placeholder={placeholder}
                                type={isPassword ? (showPassword ? "text" : "password") : type}
                                {...field}
                            />
                            {isPassword && (
                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormField;
