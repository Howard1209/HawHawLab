import { useState, useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { GoPerson } from "react-icons/go";
import { MdAttachMoney, MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form"

const Header = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const sentLogin = (data) => console.log(data);

  const [isShowing, setIsShowing] = useState(false);
  const wrapperRef = useRef(null);
  const [isRegister, setIsRegister] = useState(false);

  const changeToLogin = () => setIsRegister(false);
  const changeToRegister = () => {
    console.log('test');
    setIsRegister(true);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowing(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [wrapperRef])

  useEffect(() => {
    let html = document.querySelector("html")

    if (html) {
      if (isShowing && html) {
        html.style.overflowY = "hidden"

        const focusableElements =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

        const modal = document.querySelector("#modal") // select the modal by it's id

        const firstFocusableElement =
          modal.querySelectorAll(focusableElements)[0] // get first element to be focused inside modal

        const focusableContent = modal.querySelectorAll(focusableElements)

        const lastFocusableElement =
          focusableContent[focusableContent.length - 1] // get last element to be focused inside modal

        document.addEventListener("keydown", function (e) {
          if (e === 27) {
            setIsShowing(false)
          }

          let isTabPressed = e.key === "Tab" || e === 9

          if (!isTabPressed) {
            return
          }

          if (e.shiftKey) {
            // if shift key pressed for shift + tab combination
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus() // add focus for the last focusable element
              e.preventDefault()
            }
          } else {
            // if tab key is pressed
            if (document.activeElement === lastFocusableElement) {
              // if focused has reached to last focusable element then focus first focusable element after pressing tab
              firstFocusableElement.focus() // add focus for the first focusable element
              e.preventDefault()
            }
          }
        })

        firstFocusableElement.focus()
      } else {
        html.style.overflowY = "visible"
      }
    }
  }, [isShowing])

  return(
    <header className="App-header text-xl p-2 h-12 flex items-center bg-[#1D1D1E]
    rounded font-semibold w-[calc(100vw-178px)]z-50">
      <p className="text-[#BABCBC]">HawHaw</p>
      <MdAttachMoney className="text-[#E7893C] text-3xl"/>
      <p className="text-[#BABCBC]">Lab</p>
      <div onClick={() => setIsShowing(true)} className="flex rounded-3xl w-32 mr-1 ml-auto h-8 items-center justify-center
      bg-[#343435] text-[#BABCBC] cursor-pointer hover:text-[#30DEAB]">
        <GoPerson className="mr-2" size={23}/>
        <span className="text-base">Sign in</span>
      </div>

      {isShowing && typeof document !== "undefined"
        ? ReactDOM.createPortal(
            <div
              className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-[#141415]/30 backdrop-blur-sm"
              aria-labelledby="header-4a content-4a"
              aria-modal="true"
              tabIndex="-1"
              role="dialog"
            >
              {/*    <!-- Modal --> */}
              <div
                ref={wrapperRef}
                className="flex max-h-[90vh] max-w-sm flex-col gap-4 overflow-hidden rounded bg-[#1D1D1E] p-6 text-slate-500 shadow-3xl shadow-[#141415]"
                id="modal"
                role="document"
              >
                {/*        <!-- Modal header --> */}
                <header id="header-4a" className="flex items-center">
                  <h3 className="flex-1 text-lg font-medium text-[#30DEAB]">
                    {isRegister?'Join us!':'Welcome back!'}
                  </h3>
                  <button
                    onClick={() => setIsShowing(false)}
                    className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-xl font-medium tracking-tight  text-[#505051] transition duration-300 hover:bg-[#434344] hover:text-[#babcbc] focus-visible:outline-none disabled:cursor-not-allowed disabled:text-zinc-300 disabled:shadow-none disabled:hover:bg-transparent"
                    aria-label="close dialog"
                  >
                    <span className="relative only:-mx-5">
                      <MdOutlineCancel>
                        <title id="title-79">Icon title</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </MdOutlineCancel>
                    </span>
                  </button>
                </header>
                {/*        <!-- Modal body --> */}
                <form 
                  onSubmit={handleSubmit(sentLogin)}
                >
                  <div id="content-4a" className="flex-1">
                    <div className="flex flex-col gap-6">
                    {isRegister &&
                        <div className="relative">
                          <input
                            {...register("username", {required:'This is required.'})}
                            type="text"
                            name="name"
                            placeholder="Username"
                            className="peer relative h-10 w-full rounded border bg-[#1d1d1e] px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-zinc-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          />
                          <label
                            htmlFor="email"
                            className="absolute left-2 -top-2 z-[1] px-2 text-xs bg-[#1d1d1e] text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-[#1d1d1e] before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                          >
                            Username
                          </label>
                          <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition peer-invalid:text-pink-500">
                            {errors.email ?<span className="text-[#FF5972]">{errors.email?.message}</span>:<span>Type your name</span>}
                          </small>
                        </div>
                      }

                      {/*                <!-- Input field --> */}
                      <div className="relative mt-4">
                        <input
                          {...register("email", {required:'This is required.'})}
                          type="email"
                          name="email"
                          placeholder="your email"
                          className="peer relative h-10 w-full rounded border bg-[#1d1d1e] px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-zinc-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-2 -top-2 z-[1] px-2 text-xs bg-[#1d1d1e] text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-[#1d1d1e] before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                        >
                          Your email
                        </label>
                        {/* {errors.email && <small>{errors.email?.message}</small>} */}
                        <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition peer-invalid:text-pink-500">
                          {errors.email ?<span className="text-[#FF5972]">{errors.email?.message}</span>:<span>Type your email address</span>}
                        </small>
                      </div>
                      {/*                <!-- Input field --> */}
                      <div className="relative my-4">
                        <input
                          {...register("password", {required:'This is required.', minLength:{value:6, message:'Min length is 6'}})}
                          type="password"
                          name="password"
                          placeholder="your password"
                          className="peer relative h-10 w-full rounded border bg-[#1d1d1e] border-slate-200 px-4 pr-12 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-zinc-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <label
                          htmlFor="password"
                          className="absolute left-2 -top-2 z-[1] px-2 text-xs bg-[#1d1d1e] text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-[#1d1d1e] before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                        >
                          Your password
                        </label>
                        <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition peer-invalid:text-pink-500">
                          {errors.password ?<span className="text-[#FF5972]">{errors.password?.message}</span>:<span>Type your password</span>}
                        </small>
                      </div>
                    </div>
                  </div>
                  {/*        <!-- Modal actions --> */}
                  <div className="flex justify-center gap-2 mt-3">
                    <button type="submit" className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-zinc-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-zinc-600 hover:text-[#30DEAB] focus:bg-zinc-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-300 disabled:shadow-none">
                      <span>Login</span>
                    </button>
                  </div>
                </form>
                <small>
                  <span>Do not have an account? </span>
                  {isRegister?
                    <button type="button" onClick={changeToLogin} className="text-[#E7893C]">Login</button>:
                    <button type="button" onClick={changeToRegister} className="text-[#E7893C]">Sign up</button>
                  }
                </small>
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  )
}

export default Header