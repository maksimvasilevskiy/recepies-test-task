import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type PropsWithChildren } from "react";
import Image from "next/image";

type Props = PropsWithChildren<{
  title: string;
  isOpen: boolean;
  handleClose: () => void;
}>;

export default function Modal({ title, isOpen, handleClose, children }: Props) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="m-4 flex flex-col rounded-[20px] bg-white p-[24px]">
              <div className="flex justify-between">
                <Dialog.Title className="text-2xl font-bold">
                  {title}
                </Dialog.Title>
                <button onClick={handleClose} className="focus:outline-none">
                  <Image alt="plus" src="/icons/close.svg" width={24} height={24}/>
                </button>
              </div>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}