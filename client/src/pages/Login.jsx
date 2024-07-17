import { useState } from "react";
import nobelimg from "../assets/logos/nobel_dark.png";
import { useFormik } from "formik";
import * as yup from "yup";
import useAuthCalls from "../service/useAuthCalls";

const Login = () => {
  const { login } = useAuthCalls();
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Lütfen geçerli bir email giriniz")
      .required("Email girişi zorunludur"),
    password: yup
      .string("Enter your password")
      .required("Şifre zorunludur.")
      .min(8, "Şifre en az 8 karakter içermelidir")
      .max(16, "Şifre en fazla 16 karakter içermelidir")
      .matches(/\d+/, "Şifre en az bir rakam içermelidir")
      .matches(/[a-z]/, "Şifre en az bir küçük harf içermelidir")
      .matches(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
      .matches(/[@$!%*?&]+/, "Şifre en az bir özel karakter (@$!%*?&) içermelidir")
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      login(values)
        .then(() => {
          setSubmitting(false);
          setErrorMessage("");
        })
        .catch(error => {
          setSubmitting(false);
          setErrorMessage("Login failed. Please check your credentials and try again.");
        });
    }
  });

  return (
    <>
      <div className="flex min-h-screen bg-gray-900 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src={nobelimg}
            alt="Your Company"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Giriş Yap
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email Adresi
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Şifre
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Şifremi unuttum
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm">{formik.errors.password}</div>
                ) : null}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                disabled={formik.isSubmitting}
              >
                Giriş yap
              </button>
              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Hesabınız yok mu?{' '}
            <a href="/register" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
              Kayıt Ol
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
