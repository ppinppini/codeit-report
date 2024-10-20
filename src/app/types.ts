export interface ITodo {
    id: number;
    name: string;
    isCompleted: boolean;
}

export interface IDetailTodo {
    id: number;
    name: string;
    isCompleted: boolean;
    imageUrl: string;
    memo: string;
    tenantId: string;
}
