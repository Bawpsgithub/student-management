import React from "react"

import Topbar from "@/components/Topbar"
import Button from "../components/Button"
import Form from "@/components/Form"


const TeacherManage = () => {
    return (
      <div>
        <Topbar NamePage='Teacher Management'/>
        {/* <div className="flex justify-center item-center">
          <Button 
            btnName="Sign in"
            classStyles={`mx-2 rounded-xl active:scale-110 duration-100`}
            handleClick={() => {
              router.push('/signin')
            }}
          />
        </div> */}
        <p className=" p-5 mt-5 text-3xl font-poppins font-bold">Làm bảng cho cái trang này</p>
      </div>
    )
}

export default TeacherManage