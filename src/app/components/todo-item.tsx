"use client";

import uncheckedIcon from "../assets/todo-unchecked.png";
import checkedIcon from "../assets/todo-checked.png";
import Image from "next/image";
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { ITodo } from "../types";
import { useMutation } from "@tanstack/react-query";
import { updateTodo } from "../acitons/todo.action";
import { queryClient } from "../config/ReactQueryProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const TodoItem = ({ id, name, isCompleted }: ITodo) => {
    const pathName = usePathname();
    const [todo, setTodo] = useState(name);
    const [checked, setChecked] = useState(isCompleted);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    // useEffect로 isCompleted 상태와 checked 상태 동기화
    useEffect(() => {
        setChecked(isCompleted);
    }, [isCompleted]);

    // 할 일의 체크 상태를 서버에 전송하는 함수
    const updateCheckedMutation = useMutation({
        mutationFn: () => updateTodo("ppinppini", id, checked, todo),
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });

    // 할 일의 할일 내용을 서버에 전송하는 함수
    const updateTodoTextMutation = useMutation({
        mutationFn: (todo: string) => updateTodo("ppinppini", id, checked, todo),
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });

    // 상태 업데이트 후 서버에 요청 보내기
    const handleCheckToggle = async () => {
        setChecked((prev) => !prev); // 로컬 상태 업데이트
        updateCheckedMutation.mutate(); // 서버에 상태 업데이트 요청
    };

    // 디바운스된 할 일 업데이트
    const handleTodoChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const updatedTodo = e.target.value;
            setTodo(updatedTodo); // 상태 업데이트

            console.log(updatedTodo);

            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            // 새로운 타이머 설정 (1초 후에 서버에 업데이트 요청)
            const newTimer = setTimeout(() => {
                updateTodoTextMutation.mutate(updatedTodo); // 최신 todo 값으로 mutation 호출
            }, 500);

            setDebounceTimer(newTimer);
        },
        [debounceTimer, updateTodoTextMutation]
    );

    return (
        <div className={`border-2 border-black rounded-3xl p-4 flex items-center gap-4 mb-4 ${checked ? "bg-[#EDE9FE]" : ""} ${pathName.startsWith(`/items/${id}`) ? "justify-center" : ""}`}>
            <span className="cursor-pointer" onClick={handleCheckToggle}>
                {!checked ? <Image src={uncheckedIcon} alt="unchecked-icon" /> : <Image src={checkedIcon} alt="checked-icon" />}
            </span>
            {/* 할일 상세 페이지에서만 적용되는 조건부 렌더링 */}
            {pathName.startsWith(`/items/${id}`) ? (
                <input type="text" value={todo} onChange={handleTodoChange} placeholder={name} className={`${checked ? "line-through bg-[#EDE9FE]" : "underline"} placeholder:text-black`} />
            ) : (
                <Link href={`/items/${id}`}>
                    <span className={checked ? "line-through" : ""}>{name}</span>
                </Link>
            )}
        </div>
    );
};
