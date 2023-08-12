"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";

const Nav = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const dropdownRef = useRef();
  const { push } = useRouter();



  useEffect(() => {

    const handleOutClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToggleDropdown(false)
      }
    }

    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response)
    }

    window.addEventListener('click', handleOutClick)

    setUpProviders();

    return () => {
      window.removeEventListener('click', handleOutClick)
    }
  }, []);



  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          width={30}
          height={30}
          className="object-contain"
          src="/assets/images/logo.svg"
          alt="logo"
        />
        <p className="logo_text">Promptopia</p>
      </Link>

      {/* desktop nav */}
      <div className="hidden sm:flex ">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link
              href='/create-prompt'
              className="black_btn">
              Create Post
            </Link>

            <button type="button" onClick={() => {
              signOut();
              push('/')
            }} className="outline_btn">
              Sign Out
            </button>
            <Link href='/profile'>
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile picture"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => {
                return (
                  <button
                    type="button"
                    key={provider.id}
                    onClick={() => signIn(provider.id)}
                    className="black_btn"
                  >
                    Sign In with {provider.name}
                  </button>
                )
              })
            }
          </>
        )}
      </div>

      {/* mobile nav */}
      <div className="flex relative sm:hidden">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile pic"
              onClick={(e) => {
                e.stopPropagation();
                setToggleDropdown(prev => !prev);
              }}
            />
            {toggleDropdown && (
              <div ref={dropdownRef} className="dropdown">
                <Link
                  href='/profile'
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href='/create-prompt'
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut()
                    push('/')
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {
              providers && Object.values(providers).map(provider => {
                return (
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="black_btn"
                  >
                    Sign In
                  </button>
                )
              })
            }
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
