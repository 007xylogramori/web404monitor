import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate=useNavigate();
  const [error, setError] = useState("");

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  // eslint-disable-next-line no-control-regex
  const isValidEmail =/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const isValidPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const validateEmail = (email) => {
    return isValidEmail.test(email);
  };

  const validatePassword = (password) => {
    return isValidPassword.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitButtonDisabled) return;
    if (!signupDetails.name.trim() || !signupDetails.email.trim()) {
      setError("All Fields are Required");
      return;
    }

    if (validateEmail(!signupDetails.email)) {
      setError("Email is Not valid");
      return;
    }
    if (signupDetails.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!validatePassword(signupDetails.password)) {
      setError(
        "Password must have at least one uppercase letter, lowercase letter, number, special character"
      );
      return;
    }

    setError("");

    setSubmitButtonDisabled(true);

    const res = await fetch(import.meta.env.VITE_API_URL + "/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },

      body: await JSON.stringify({
        name: signupDetails.name,
        email: signupDetails.email,
        password: signupDetails.password,
      }),
    }).catch((error) => {
      setError("Error creating account", error);
      console.log(error);
      return;
    });

    setSubmitButtonDisabled(false);

    if (!res) {
      setError("Error creating account");
      return;
    }

    const data = await res.json();
    if (data.status == false) {
      setError(data.message);
      return;
    }
    const tokens = data.data.tokens;
    localStorage.setItem("tokens", JSON.stringify(tokens));
    navigate('/')

  };

  return (
    <div className="flex max-h-[100vh] overflow-hidden min-h-screen   items-center justify-center text-gray-600 bg-gray-50">
      <div className="relative">
        <div className="hidden sm:block h-56 w-56 text-indigo-300 absolute a-z-10 -left-20 -top-20">
          <svg
            id="patternId"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="a"
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
                patternTransform="scale(0.6) rotate(0)"
              >
                <rect x="0" y="0" width="100%" height="100%" fill="none" />
                <path
                  d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                  strokeWidth="1"
                  stroke="none"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="800%"
              height="800%"
              transform="translate(0,0)"
              fill="url(#a)"
            />
          </svg>
        </div>
        <div className="hidden sm:block h-28 w-28 text-indigo-300 absolute a-z-10 -right-20 -bottom-20">
          <svg
            id="patternId"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="b"
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
                patternTransform="scale(0.5) rotate(0)"
              >
                <rect x="0" y="0" width="100%" height="100%" fill="none" />
                <path
                  d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                  strokeWidth="1"
                  stroke="none"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="800%"
              height="800%"
              transform="translate(0,0)"
              fill="url(#b)"
            />
          </svg>
        </div>
        {/* <!-- Register --> */}
        <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white shadow-lg px-4">
          <div className="flex-auto p-6">
            {/* <!-- Logo --> */}
            <div className="mb-6 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
              <a
                href="#"
                className="flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500"
              >
                <span className="flex-shrink-0 text-3xl font-black lowercase tracking-tight opacity-100">
                  WEB4o4 MONITOR.
                </span>
              </a>
            </div>

            <form onSubmit={handleSubmit} id="" className="mb-4">
              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                >
                  Name
                </label>
                <input
                  onChange={(event) => {
                    setSignupDetails({
                      ...signupDetails,
                      name: event.target.value,
                    });
                  }}
                  value={signupDetails.name}
                  type="text"
                  className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  autoFocus=""
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                >
                  Email
                </label>
                <input
                  onChange={(event) => {
                    setSignupDetails({
                      ...signupDetails,
                      email: event.target.value,
                    });
                  }}
                  value={signupDetails.email}
                  type="text"
                  className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  autoFocus=""
                />
              </div>
              <div className="mb-4">
                <div className="flex justify-between">
                  <label
                    className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <div className="relative flex w-full flex-wrap items-stretch">
                  <input
                    onChange={(event) => {
                      setSignupDetails({
                        ...signupDetails,
                        password: event.target.value,
                      });
                    }}
                    value={signupDetails.password}
                    type="password"
                    id="password"
                    className="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                    name="password"
                    placeholder="············"
                  />
                </div>
              </div>

              <div className="py-0.5 text-[13px] text-red-500 px-2">
                {error ? error : ""}
              </div>

              <div className="mb-4">
                {!submitButtonDisabled ? (
                  <button
                    className="grid w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none"
                    type="submit"
                  >
                    Sign Up
                  </button>
                ) : (
                  <button
                    className=" w-full  select-none rounded-md border border-indigo-300 bg-indigo-300 py-2 px-5 flex justify-center items-center gap-3 text-sm text-white shadow cursor-not-allowed "
                    type="submit"
                  >
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-white fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                    <span>Signing Up....</span>
                  </button>
                )}
              </div>
            </form>

            <p className="mb-4 text-center">
              Already have an account?
              <Link
                to="/login"
                className="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"
              >
                {" "}
                Sign in
              </Link>
            </p>
          </div>
        </div>
        {/* <!-- /Register --> */}
      </div>
    </div>
  );
};

export default Signup;
