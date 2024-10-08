/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
};

export type CreateDocumentInput = {
  accessKey: Scalars['String']['input'];
  maxViewCount?: InputMaybe<Scalars['Int']['input']>;
  ttlMs?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['String']['input'];
};

export type Document = {
  __typename?: 'Document';
  accessKey: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  id: Scalars['Int']['output'];
  maxViewCount: Scalars['Int']['output'];
  ttlMs: Scalars['Int']['output'];
  updatedAt: Scalars['Time']['output'];
  value: Scalars['String']['output'];
  viewCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createDocument?: Maybe<Scalars['Int']['output']>;
  deleteDocument?: Maybe<Scalars['Boolean']['output']>;
  updateDocument?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationCreateDocumentArgs = {
  input: CreateDocumentInput;
};


export type MutationDeleteDocumentArgs = {
  accessKey: Scalars['String']['input'];
  id: Scalars['Int']['input'];
};


export type MutationUpdateDocumentArgs = {
  input: UpdateDocumentInput;
};

export type Query = {
  __typename?: 'Query';
  getDocument?: Maybe<Document>;
};


export type QueryGetDocumentArgs = {
  id: Scalars['Int']['input'];
};

export type UpdateDocumentInput = {
  accessKey: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  maxViewCount: Scalars['Int']['input'];
  ttlMs: Scalars['Int']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDocumentMutationVariables = Exact<{
  value: Scalars['String']['input'];
  accessKey: Scalars['String']['input'];
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', createDocument?: number | null };

export type DeleteDocumentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  accessKey: Scalars['String']['input'];
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', deleteDocument?: boolean | null };

export type GetDocumentQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', getDocument?: { __typename?: 'Document', id: number, createdAt: any, updatedAt: any, value: string, accessKey: string, viewCount: number, maxViewCount: number, ttlMs: number } | null };

export type UpdateDocumentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  value: Scalars['String']['input'];
  accessKey: Scalars['String']['input'];
  ttlMs: Scalars['Int']['input'];
  maxViewCount: Scalars['Int']['input'];
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', updateDocument?: boolean | null };


export const CreateDocumentDocument = gql`
    mutation CreateDocument($value: String!, $accessKey: String!) {
  createDocument(input: {value: $value, accessKey: $accessKey})
}
    `;
export type CreateDocumentMutationFn = Apollo.MutationFunction<CreateDocumentMutation, CreateDocumentMutationVariables>;

/**
 * __useCreateDocumentMutation__
 *
 * To run a mutation, you first call `useCreateDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDocumentMutation, { data, loading, error }] = useCreateDocumentMutation({
 *   variables: {
 *      value: // value for 'value'
 *      accessKey: // value for 'accessKey'
 *   },
 * });
 */
export function useCreateDocumentMutation(baseOptions?: Apollo.MutationHookOptions<CreateDocumentMutation, CreateDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDocumentMutation, CreateDocumentMutationVariables>(CreateDocumentDocument, options);
      }
export type CreateDocumentMutationHookResult = ReturnType<typeof useCreateDocumentMutation>;
export type CreateDocumentMutationResult = Apollo.MutationResult<CreateDocumentMutation>;
export type CreateDocumentMutationOptions = Apollo.BaseMutationOptions<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const DeleteDocumentDocument = gql`
    mutation DeleteDocument($id: Int!, $accessKey: String!) {
  deleteDocument(id: $id, accessKey: $accessKey)
}
    `;
export type DeleteDocumentMutationFn = Apollo.MutationFunction<DeleteDocumentMutation, DeleteDocumentMutationVariables>;

/**
 * __useDeleteDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDocumentMutation, { data, loading, error }] = useDeleteDocumentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      accessKey: // value for 'accessKey'
 *   },
 * });
 */
export function useDeleteDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDocumentMutation, DeleteDocumentMutationVariables>(DeleteDocumentDocument, options);
      }
export type DeleteDocumentMutationHookResult = ReturnType<typeof useDeleteDocumentMutation>;
export type DeleteDocumentMutationResult = Apollo.MutationResult<DeleteDocumentMutation>;
export type DeleteDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export const GetDocumentDocument = gql`
    query GetDocument($id: Int!) {
  getDocument(id: $id) {
    id
    createdAt
    updatedAt
    value
    accessKey
    viewCount
    maxViewCount
    ttlMs
  }
}
    `;

/**
 * __useGetDocumentQuery__
 *
 * To run a query within a React component, call `useGetDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDocumentQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables> & ({ variables: GetDocumentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
      }
export function useGetDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
        }
export function useGetDocumentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
        }
export type GetDocumentQueryHookResult = ReturnType<typeof useGetDocumentQuery>;
export type GetDocumentLazyQueryHookResult = ReturnType<typeof useGetDocumentLazyQuery>;
export type GetDocumentSuspenseQueryHookResult = ReturnType<typeof useGetDocumentSuspenseQuery>;
export type GetDocumentQueryResult = Apollo.QueryResult<GetDocumentQuery, GetDocumentQueryVariables>;
export const UpdateDocumentDocument = gql`
    mutation UpdateDocument($id: Int!, $value: String!, $accessKey: String!, $ttlMs: Int!, $maxViewCount: Int!) {
  updateDocument(
    input: {id: $id, value: $value, accessKey: $accessKey, ttlMs: $ttlMs, maxViewCount: $maxViewCount}
  )
}
    `;
export type UpdateDocumentMutationFn = Apollo.MutationFunction<UpdateDocumentMutation, UpdateDocumentMutationVariables>;

/**
 * __useUpdateDocumentMutation__
 *
 * To run a mutation, you first call `useUpdateDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDocumentMutation, { data, loading, error }] = useUpdateDocumentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      value: // value for 'value'
 *      accessKey: // value for 'accessKey'
 *      ttlMs: // value for 'ttlMs'
 *      maxViewCount: // value for 'maxViewCount'
 *   },
 * });
 */
export function useUpdateDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDocumentMutation, UpdateDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDocumentMutation, UpdateDocumentMutationVariables>(UpdateDocumentDocument, options);
      }
export type UpdateDocumentMutationHookResult = ReturnType<typeof useUpdateDocumentMutation>;
export type UpdateDocumentMutationResult = Apollo.MutationResult<UpdateDocumentMutation>;
export type UpdateDocumentMutationOptions = Apollo.BaseMutationOptions<UpdateDocumentMutation, UpdateDocumentMutationVariables>;