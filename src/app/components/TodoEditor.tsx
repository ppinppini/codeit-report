"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, getTodos } from "../acitons/todo.action";
import { useState } from "react";

import Image from "next/image";
import { TodoItem } from "./todo-item";
import todoIcon from "../assets/todo.png";
import DoneIcon from "../assets/done.png";
import doneEmpty from "../assets/empty2.png";
import todoEmpty from "../assets/empty1.png";
import { ITodo } from "../types";
// 할일 목록 페이지의 컴포넌트
export const TodoEditor = () => {
    const [todo, setTodo] = useState("");

    const tenantId = "ppinppini";
    const queryClient = useQueryClient();
    const todosQuery = useQuery({
        queryKey: ["todos"],
        queryFn: () => getTodos(tenantId),
    });
    // 새로운 할 일을 추가하는 함수
    const createTodoMutation = useMutation({
        mutationFn: () => {
            return createTodo(tenantId, {
                id: Date.now(),
                name: todo,
                isCompleted: false,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
            setTodo("");
        },
    });

    return (
        <>
            <div className="flex">
                <input
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            createTodoMutation.mutate();
                        }
                    }}
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    className="flex-1 mr-5 shadow shadow-black border-2 border-r-4 border-b-4 bg-[#F1F5F9] border-black rounded-3xl px-4 py-2 "
                    type="text"
                    placeholder="할 일을 입력해주세요"
                />
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        if (todo.trim()) {
                            createTodoMutation.mutate();
                        }
                    }}
                >
                    {todosQuery?.data?.length <= 0 ? (
                        <div className="flex items-center bg-[#7C3AED] text-white  shadow shadow-black border-2 border-r-4 border-b-4 rounded-3xl border-black px-4 py-2">
                            <span className="text-2xl flex items-center">+</span>
                            <span className="ml-2 hidden mobile:block">추가하기</span>
                        </div>
                    ) : (
                        <div className="flex items-center bg-[#E2E8F0] shadow shadow-black border-2 border-r-4 border-b-4 rounded-3xl border-black px-4 py-2">
                            <span className="text-2xl">+</span>
                            <span className="ml-2 hidden mobile:block">추가하기</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full py-8 flex flex-col gap-4 desktop:flex-row tablet:flex-col ">
                <section className="desktop:w-1/2 flex flex-col gap-2">
                    <Image src={todoIcon} alt="todo-icon" />
                    {/* // isCompleted가 false인 항목만 렌더링 */}
                    {todosQuery?.data?.filter((todo: ITodo) => !todo.isCompleted).length > 0 ? (
                        todosQuery?.data?.filter((todo: ITodo) => !todo.isCompleted).map((todo: ITodo) => <TodoItem key={todo.id} {...todo} />)
                    ) : (
                        <div className="flex items-center flex-col">
                            <Image src={todoEmpty} alt="할일 목록 없을 때 이미지" className="w-[240px] h-[240px]" />
                            <span className="text-[#94A3B8] text-center">
                                할 일이 없어요!
                                <br />
                                TODO를 새롭게 추가해주세요!
                            </span>
                        </div>
                    )}
                </section>
                <section className="h desktop:w-1/2 flex flex-col gap-2 ">
                    <Image src={DoneIcon} alt="todo-icon" />
                    {/* // isCompleted가 true인 항목만 렌더링 */}
                    {todosQuery?.data?.filter((todo: ITodo) => todo.isCompleted).length > 0 ? (
                        todosQuery?.data?.filter((todo: ITodo) => todo.isCompleted).map((todo: ITodo) => <TodoItem key={todo.id} {...todo} />)
                    ) : (
                        <div className="flex items-center flex-col">
                            <Image src={doneEmpty} alt="완료된 투두가 없을 때 빈 이미지" className="w-[240px] h-[240px] " />
                            <span className="text-[#94A3B8]">
                                아직 다 한 일이 없어요! <br />
                                해야 할 일을 체크해보세요!
                            </span>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};
