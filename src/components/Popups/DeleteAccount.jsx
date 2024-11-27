"use client";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import * as React from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import del from "../../../public/svgs/del.svg";
import key from "../../../public/svgs/key.svg";
import { useRouter } from "next/navigation";

export default function Component() {
  const [firstModalOpen, setFirstModalOpen] = React.useState(false);
  const [secondModalOpen, setSecondModalOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [error, setError] = React.useState(false);
  const timerRef = React.useRef();
  const token = localStorage.getItem("token");
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const inputRefs = React.useRef([]);
  const router = useRouter();

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const sendPassword = async () => {
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
      password: password,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/delete_acc",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("token send ", response);

      if (response.data.action == "success") {
        setError(false);
        console.log(response);

        console.log(JSON.stringify(response.data));
        return true;
      } else {
        setError(true);
        console.log(response.data.action);

        return false;
      }
    } catch (error) {
      setError(true);
      console.log(error);
      return false;
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleNext = async () => {
    setTimeLeft(60);
    const success = await sendPassword();
    if (success) {
      setFirstModalOpen(false);
      setSecondModalOpen(true);
      startTimer();
    }
  };

  const handleConfirmDelete = () => {
    const axios = require("axios");
    let data = JSON.stringify({
      otp: parseInt(otp.join("")),
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/confirm_delete_acc",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.action == "success") {
          localStorage.clear();
          clearInterval(timerRef.current);
          setSecondModalOpen(false);
          console.log(JSON.stringify(response.data));

          routerrouter.push("/");
        } else {
          console.log(response.data.action);

          return false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <button
        className="text-[#C80101] flex gap-2"
        onClick={() => setFirstModalOpen(true)}
      >
        <Image src={del} alt="Delete" loading="lazy" />
        Delete Accounts
      </button>

      <Dialog open={firstModalOpen} onOpenChange={setFirstModalOpen}>
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mx-auto font-semibold">
              Delete Account
            </DialogTitle>
            <DialogDescription className="space-y-3 mt-2">
              <span className="text-[#C80101] font-semibold flex gap-2 items-center mt-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-destructive " /> Delete
                your account will:
              </span>
              <span className="text-black">
                We're sorry to see you go. If you're sure you want to delete
                your Talk Tango account, please be aware that this action is
                permanent and can't be undone. All of your personal information,
                including your jokes and settings, will be permanently deleted.
              </span>
              <span className="text-black">
                If you're having trouble with your account or have concerns,
                please reach out to us at{" "}
                <span className="font-medium">[contact email]</span> or support
                page before proceeding with the account deletion. We'd love to
                help you resolve any issues and keep you as a valued Talk Tango
                user.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-black">
              To delete your account, type your password in the field below and
              confirm your decision by clicking the "Next" button.
            </p>
            <div className="relative flex border px-2 rounded-full py-1">
              <Image src={key} alt="" loading="lazy" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-0 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm">
                Invalid password. Please try again.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFirstModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              disabled={!password}
              className="bg-[#2CB67D] hover:bg-[#2CB67D]/90"
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={secondModalOpen} onOpenChange={setSecondModalOpen}>
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-semibold justify-center">
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 ">
            <p className="text-[#3A3A3A]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              tristique leo a turpis consequat malesuada. In eu neque sit amet.
            </p>
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="flex gap-5 mx-auto pb-6">
                  {otp.map((digit, index) => (
                    <span
                      key={index}
                      className="flex items-center w-11 h-10 border-2 border-color-input rounded-lg p-2"
                    >
                      <input
                        type="tel"
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="w-full h-full border-0 outline-none focus:ring-0 text-center"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-2xl font-semibold text-center  ">
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className=" text-[#ACACAC] border-none"
                onClick={handleNext}
              >
                Send again
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              className="w-full bg-[#C80101] text-white rounded-full mx-auto"
              onClick={handleConfirmDelete}
              disabled={timeLeft === 0}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
