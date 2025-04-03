"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import sent from "../../../public/svgs/sent.svg";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import balance from "../../../public/messages/balance.svg";
import close from "../../../public/svgs/close.svg";
import { X } from "lucide-react";
import back from "../../../public/svgs/back.svg";

export default function MoneyTransferPopups({ newid }) {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sendamount, setSendAmount] = useState();
  const [password, setpassword] = useState();

  const closeAll = () => {
    setIsMainOpen(false);
    setIsRequestOpen(false);
    setIsSendOpen(false);
    setIsConfirmOpen(false);
  };

  //send money api :
  const handlesendmoney = () => {
   
    if (sendamount != undefined && password != undefined) {
      const token = localStorage.getItem("token");

      const axios = require("axios");
      let data = JSON.stringify({
        token: token,
        amount: sendamount,
        password: password,
        to_user_id: newid,
      });

      

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://talktango.estamart.com/api/send_money",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          
          if (response.data.action === "success") {
            setIsConfirmOpen(true);
            setIsRequestOpen(false);
          } else {
            console.log("error");
          }
        })
        .catch((error) => {
          setIsRequestOpen(true);
          setIsConfirmOpen(false);
          console.log(error);
        });
    }

    setSendAmount(undefined);
    setpassword(undefined);
  };

  // Request money API

  const [amount, setAmount] = useState();
  const requestmoney = () => {


    setAmount(sendamount);
    if (sendamount != undefined) {
      const token = localStorage.getItem("token");

      const axios = require("axios");
      let data = JSON.stringify({
        token: token,
        amount: sendamount,
        to_user_id: newid,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://talktango.estamart.com/api/request_money",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          // If the API call is successful, open the "Confirm" popup
          setIsConfirmOpen(true);
          setIsRequestOpen(false);
          // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          setIsRequestOpen(true);
          setIsConfirmOpen(false);
          console.log(error);
        });
    }

    setSendAmount(undefined);
  };

  
  const handleBack = () => {
    setIsRequestOpen(false);
    setIsMainOpen(true);
    // You can add more cases if there are additional nested modals
  };

  return (
    <Dialog
      open={isMainOpen}
      onOpenChange={(open) => {
        setIsMainOpen(open);
        if (open) {
          setIsRequestOpen(false);
          setIsSendOpen(false);
          setIsConfirmOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className=" border-none bg-transparent ">
          <Image src={balance} alt="balance" loading="lazy" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center"></DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-none">
            {/* <Image src={close} alt="" /> */}
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col  items-start gap-2">
          <Button
            onClick={() => {
              setIsRequestOpen(true);
              setIsMainOpen(false);
            }}
            className="bg-white shadow-none text-black hover:bg-white text-xl"
          >
            Request For Money
          </Button>
          <Button
            onClick={() => {
              setIsSendOpen(true);
              setIsMainOpen(false);
            }}
            className="bg-white shadow-none text-black hover:bg-white text-xl"
          >
            Send Money
          </Button>
        </div>
      </DialogContent>

      <Dialog
        open={isRequestOpen}
        onOpenChange={(open) => {
          setIsRequestOpen(open);
          if (open) setIsMainOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-24 cursor-pointer">
              <Image src={back} alt="balnce" onClick={handleBack} />
              <DialogTitle>Request For Money</DialogTitle>
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-none">
              {/* <span className="sr-only">Close</span> */}
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div>
              <span className="text-center text-sm w-full">
                <p className="text-[#3A3A3A] w-56 mx-auto">
                Please enter the amount  below to proceed with your money request
                </p>
              </span>
            </div>
            <span className="pt-6 pb-6  border bg-[#FFFFFF]">
              <Input
                type="text"
                placeholder="1500$"
                className="border-none mx-auto outline-none w-16 "
                onChange={(e) => setSendAmount(e.target.value)}
              />
            </span>
            <Button
              onClick={() => {
                requestmoney();
              }}
              className="bg-[#049C01] rounded-lg hover:bg-[#049C01]"
            >
              Send Money Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSendOpen}
        onOpenChange={(open) => {
          setIsSendOpen(open);
          if (open) setIsMainOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Amount"
              onChange={(e) => setSendAmount(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Password"
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button
              onClick={() => {
                handlesendmoney();
              }}

              className="bg-[#049C01] rounded-lg hover:bg-[#049C01]"
            >
              Send Money
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <Image
              src={sent}
              width={80}
              alt=""
              className="mx-auto"
              loading="lazy"
            />
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none  disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold">Money Request Sent</p>
            <p className="text-[#1A1A1A] w-72 text-center">
            Your request for ${amount} has been successfully sent. The recipient will be notified shortly    
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
