import {
  QueryKey,
  UseMutationOptions as MutationOptions,
  UseQueryOptions as QueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

export type ResponseError = AxiosError<{
  statusCode: string
  message: string
  error: string
}>

export type UseMutationOptions<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
> = Omit<
  MutationOptions<TData, ResponseError, TVariables, TContext>,
  'mutationFn'
>

export type UseQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  QueryOptions<TQueryFnData, ResponseError, TData, TQueryKey>,
  'queryKey'
>
