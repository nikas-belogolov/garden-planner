import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'


export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/',
    }),
    endpoints: (build) => ({
        getPlants: build.query<any, void>({
            query: () => ({ url: "plants"}),
            transformResponse: (response: Array<object>) => {
              return response
            }
        })
    })
})

export const { useGetPlantsQuery } = api