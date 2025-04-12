import React, { useState } from 'react'
import { TextInput } from '../TextInput'
import styles from './CreateUser.module.css'
import { useCreateUserMutation } from '../../store/api/usersApi'
import { storage } from '../../firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const CreateUser = () => {
    const [createUser] = useCreateUserMutation()

    const [clientInfo, setClientInfo] = useState('')
    const [clientName, setClientName] = useState('')
    const [workDescription, setWorkDescription] = useState('')
    const [status, setStatus] = useState('')
    const [file, setFile] = useState(null)
    const [feedback, setFeedback] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const submitHandler = async () => {
        if (clientInfo !== '' && clientName !== '') {
            setFeedback(`Hej, ${clientInfo} ${clientName}, välkommen!`)
            setSubmitted(true)
            setClientInfo('')
            setClientName('')
            setTimeout(() => {
                setFeedback('')
            }, 5000)

            let imageUrl = null
            // Ladda upp filen till Firebase Storage
            if (file) {
                const storageRef = ref(storage, `files/${file.name}`) // Skapa en referens till platsen där filen ska laddas upp
                try {
                    await uploadBytes(storageRef, file) // Ladda upp filen till Firebase Storage

                    imageUrl = await getDownloadURL(storageRef)

                    console.log(
                        'Filen laddades upp till Firebase Storage',
                        imageUrl
                    )
                } catch (error) {
                    console.error(
                        'Fel vid uppladdning av fil till Firebase Storage:',
                        error
                    )
                }
            }
            createUser({
                user: {
                    clientInfo: clientInfo,
                    clientName: clientName,
                    workDescription: workDescription,
                    status: status,
                    files: [imageUrl]
                }
            })
        } else {
            setSubmitted(false)
            setFeedback('Du måste fylla i alla fält!')
        }
    }

    return (
        <div className={styles.container}>
            <TextInput
                value={clientName}
                placeholder="Namn"
                onInput={(event) => {
                    setClientName(event.target.value)
                }}
            />
            <TextInput
                value={clientInfo}
                placeholder="Adress"
                onInput={(event) => {
                    setClientInfo(event.target.value)
                }}
            />
            <TextInput
                value={workDescription}
                placeholder="Arbetsbeskrivning"
                onInput={(event) => {
                    setWorkDescription(event.target.value)
                }}
            />
            <TextInput
                value={status}
                placeholder="status"
                onInput={(event) => {
                    setStatus(event.target.value)
                }}
            />

            <input
                type="file"
                onChange={(event) => setFile(event.target.files[0])} // Uppdatera state när användaren väljer en fil
            />

            <button className={styles.submitButton} onClick={submitHandler}>
                Lägg till arbete
            </button>
            <p
                className={styles.feedbackText}
                style={{ color: submitted ? '#3c425c' : '#ed4e59' }}
            >
                {feedback}
            </p>
        </div>
    )
}
