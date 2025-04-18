import Link from "next/link";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 px-16">
      <div className="container mx-auto sm:px-4 py-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <Link href="/">
            <h1 className="text-2xl font-semibold text-[#049C01]">GranaME</h1>
          </Link>
          <nav className="flex space-x-6 ">
            <Link
              className="text-[16px] font-medium text-gray-600 hover:text-[#049C01]"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-[16px] font-medium text-gray-600 hover:text-[#049C01]"
              href="/about-us"
            >
              About
            </Link>
            <Link
              className="text-[16px] font-medium text-gray-600 hover:text-[#049C01]"
              href="/contact-us"
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between space-y-4 border-t pt-6 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Follow Us On:</span>
            <div className="flex space-x-4">
              <Link
                target="_blank"
                href="https://www.instagram.com/"
                className="text-gray-600 hover:text-[#D6009B]"
              >
                <FaInstagram className="h-5 w-5" />
                <span className=" sr-only">Instagram</span>
              </Link>
              <Link
                target="_blank"
                href="https://www.facebook.com/"
                className="text-gray-600 hover:text-[#1877F2]"
              >
                <FaFacebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                target="_blank"
                href="https://pk.linkedin.com/"
                className="text-gray-600 hover:text-[#0077B5]"
              >
                <FaLinkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            ©All Right Reserves. GranaME {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
