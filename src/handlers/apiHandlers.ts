import { TodoListData, TodoListProps } from "@/components/todoList";

export const API_ROUTE = "https://6690e00f26c2a69f6e8d72f6.mockapi.io/api/v1"

interface GetListsParams{
    username? : string,
    onFetchComplete? : (response : TodoListData[]) => void
};

export async function GetLists(params : GetListsParams) : Promise<TodoListProps[]> {
    return await fetch(`${API_ROUTE}/todoLists`)
        .then(response =>  {   
            if(!response.ok){
                return [];
                
            }
            
            return response.json();        
        })
        .then(response => {

            if(params.onFetchComplete){
                params.onFetchComplete(response);
            }

            return response;
        })
        .catch(err => console.log(err));
}

export async function GetListsForUser(params: GetListsParams) : Promise<TodoListProps[]> {
    // if(params.username === ""){
    //     if(params.onFetchComplete){
    //         params.onFetchComplete([]);
    //     }

    //     return([]);
    // }

    //%5Cb == /b for regex 
    return await fetch(`${API_ROUTE}/todoLists?username=%5Cb${params.username}%5Cb`)
        .then(response => {
            if(!response.ok){
                return [];
                
            }

            return response.json();
        })
        .then(response => {   
            if(params.onFetchComplete){
                params.onFetchComplete(response);
            }

            return response;
        })
        .catch(err => console.log(err));
}

interface PostListParams {
    listData : TodoListData,
    onFetchComplete? : (validData : TodoListData) => void
}

export async function AddNewTodoList(params : PostListParams){
    await fetch(`${API_ROUTE}/todoLists`, {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(params.listData)
    })
    .then(response => response.json())
    .then(response => {
        if(response != undefined && params.onFetchComplete){
            params.onFetchComplete(response);
        }
    })
    .catch(err => console.log(err));
}

interface DeleteListParams {
    id : number,
    onFetchComplete? : () => void
}

export async function DeleteTodoList(params : DeleteListParams) {
    await fetch(`${API_ROUTE}/todoLists/${params.id}`,
        { 
            method : "DELETE" 
        }
    )
    .then(response => {
        if(response.ok && params.onFetchComplete){
            params.onFetchComplete();
        }
    })
    .catch(err => console.log(err));
}