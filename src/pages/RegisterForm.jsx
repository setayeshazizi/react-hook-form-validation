import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import "./RegisterForm.css";

// Yup Schema
const schema = yup.object({
  fullName: yup
    .string()
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/\d/, "Password must contain at least 1 number"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  terms: yup.boolean().oneOf([true], "You must accept the terms"),
});

function RegisterForm() {
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  const checkPasswordStrength = (password) => {
    if (!password) return "";
    const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const mediumRegex = /^(?=.*\d).{8,}$/;

    if (strongRegex.test(password)) return "Strong";
    if (mediumRegex.test(password)) return "Medium";
    return "Weak";
  };

  const onSubmit = (data) => {
    console.log(data);
    setSuccess(true);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2 className="title">Register Form</h2>
          <p className="subtitle">Create your account</p>
        </div>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label>Full Name</label>
            <input type="text" {...register("fullName")} />
            {errors.fullName && (
              <p className="error">{errors.fullName.message}</p>
            )}
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" {...register("email")} />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="field" style={{ position: "relative" }}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              onChange={(e) => {
                register("password").onChange(e);
                setPasswordStrength(checkPasswordStrength(e.target.value));
              }}
            />
            <button
              type="button"
              className="showHideBtn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
            {passwordStrength && (
              <p className={`passwordStrength ${passwordStrength}`}>
                Strength: {passwordStrength}
              </p>
            )}
          </div>

          <div className="field">
            <label>Confirm Password</label>
            <input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="field">
            <label className="row">
              <input
                type="checkbox"
                {...register("terms")}
                className="checkbox"
              />
             I accept the Terms & Conditions
            </label>
            {errors.terms && <p className="error">{errors.terms.message}</p>}
          </div>

          <div className="actions">
            <button type="submit" className="primary">
              Register
            </button>
          </div>

          {success && <p className="success">Registration Successful!</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
