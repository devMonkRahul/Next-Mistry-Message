"use client"

import { Message } from "@/model/User.model"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId))
  }

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get(`/api/accept-messages`)
      setValue("acceptMessages", response.data.isAcceptingMessages)
    } catch (error) {
      
    }
  }, [setValue])
  return (
    <div>Dashboard</div>
  )
}
