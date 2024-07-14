/**
 * This file contains facade over the mockAPI
 * Allows basic CRUD operations with user's tasks in certain list
 * 
 * In my mockAPI scheme, tasks are subentity to the lists, 
 * each task has foreign key todoListId, which is the primary key
 * of parent list.
 * 
 * Methods also contain callbacks on certain actions, for example
 * there is frequent use of methods like "onFetchComplete", which
 * itself are defined in placed where the parent method is called.
 * 
 * This allows for flexible design and more straightforward work
 * with the API calls
 */

import { TodoListData } from "@/components/todoList";
import { TodoTaskData } from "@/components/todoTask"

const API_ROUTE = "https://6690e00f26c2a69f6e8d72f6.mockapi.io/api/v1/todoLists"

interface GetTasksParams {
    listId : number
    onFetchComplete? : (response : TodoTaskData[]) => void
}

export async function GetTasksForList(params : GetTasksParams) : Promise<TodoTaskData[]> {
    return await fetch(`${API_ROUTE}/${params.listId}/todoTask`)
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

interface AddTaskParams {
    listId : number,
    taskData : TodoTaskData,
    onFetchComplete? : (validData : TodoTaskData) => void
}

export async function AddTodoTaskToList(params : AddTaskParams) {
    await fetch(`${API_ROUTE}/${params.listId}/todoTask`, {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(params.taskData)
        })
        .then(response => response.json())
        .then(response => {
            if(response != undefined && params.onFetchComplete){
                params.onFetchComplete(response);
            }
        })
        .catch(err => console.log(err));
}

interface DeleteTaskParams {
    id : number,
    listId : number,
    onError? : () => void
}

export async function DeleteTodoTaskFromList(params : DeleteTaskParams) {
    await fetch(`${API_ROUTE}/${params.listId}/todoTask/${params.id}`,{ 
            method : "DELETE" 
        })
        .then(response => {
            if(response.ok){
                return;
            }

            throw new Error("Failed to delete task");
        })
        .catch(err => {
            if(params.onError){
                params.onError();
            } 
            
            console.log(err);
        });
}

interface UpdateListParams {
    taskData : TodoTaskData,
    onFetchComplete? : (response : TodoTaskData) => void
}

export async function UpdateTodoTaskFromList(params : UpdateListParams) {
    await fetch(`${API_ROUTE}/${params.taskData.todoListId}/todoTask/${params.taskData.id}`, 
        {
            method : "PUT",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(params.taskData)
        }
    )
    .then(response => response.json())
    .then(response => {
        if(response != undefined && params.onFetchComplete){
            params.onFetchComplete(response);
        }
    })
    .catch(err => console.log(err));
    
}