"use server";
import { ITodo } from "../types";

// 투두 목록 불러오기
export const getTodos = async (tenantId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${tenantId}/items`);
    const todos = await response.json();
    return todos;
};

// 투두 추가하기
export const createTodo = async (tenantId: string, todo: ITodo) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${tenantId}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: todo.name }),
    });
    const createdTodo = await response.json();
    return createdTodo;
};
// 투두 상태 체크
export const updateTodo = async (tenantId: string, id: number, isCompleted: boolean, name: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${tenantId}/items/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: isCompleted, name: name }),
    });

    if (!response.ok) {
        throw new Error("투두 업데이트 실패");
    }

    return response.json();
};

// 상세 투두 불러오기
export const getTodo = async (tenantId: string, id: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${tenantId}/items/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const todo = await response.json();
    return todo;
};
// 상세 투두 수정하기 (이미지, 메모, 투두 제목, 투두 상태 )
export const editTodo = async (tenantId: string, id: number, { memo, imageUrl, name, isCompleted }: { memo: string; imageUrl: string | null; name: string; isCompleted: boolean }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${tenantId}/items/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            memo,
            imageUrl,
            name,
            isCompleted,
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to edit todo");
    }

    return await response.json();
};

// 투두 삭제하기
export const deleteTodo = async (tenantId: string, id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${tenantId}/items/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
};

// 이미지 업로드
export const createImage = async (tenantId: string, formData: FormData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${tenantId}/images/upload`, {
        method: "POST",
        body: formData,
    });
    const image = await response.json();

    return image;
};
