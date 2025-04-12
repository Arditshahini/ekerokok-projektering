import { createApi } from '@reduxjs/toolkit/query/react'
import { db } from '../../firebase-config'
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc
} from 'firebase/firestore'

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
    console.log('url:', url)
    console.log('body:', body)
    switch (method) {
        case 'GET':
            const snapshot = await getDocs(collection(db, url))
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            return { data }

        case 'POST':
            const docRef = await addDoc(collection(db, url), body)
            return { data: { id: docRef.id, ...body } }

        case 'DELETE':

            await deleteDoc(doc(db, `${url}/${body}`))
            return { data: 'Deleted successfully' }

        case 'PUT':

            await updateDoc(doc(db, `${url}/${body.id}`), body)
            return { data: body }
        default:
            throw new Error(`Unhandled method ${method}`)
    }
}

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: firebaseBaseQuery,
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: ({ user }) => ({
                baseUrl: '',
                url: 'users',
                method: 'POST',
                body: user
            })
        }),
        getUsers: builder.query({
            query: () => ({
                baseUrl: '',
                url: 'users',
                method: 'GET',
                body: ''
            })
        }),
        updateUser: builder.mutation({
            query: ({ userId, updatedData }) => ({
                baseUrl: '',
                url: `users`, 
                method: 'PUT',
                body: updatedData
            })
        }),
        deleteUser: builder.mutation({
            query: ({ userId }) => ({
                baseUrl: '',
                url: `users/${userId}`,
                method: 'DELETE',
                body: ''
            })
        })
    })
})

export const {
    useCreateUserMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApi
