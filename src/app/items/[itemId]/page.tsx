"use client";
import { createImage, getTodo, editTodo, deleteTodo } from "@/app/acitons/todo.action";
import { TodoItem } from "@/app/components/todo-item";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import uploadImgBG from "../../assets/uploadI-image-background.png";
import uploadImgBtn from "../../assets/upload-image-btn.png";
import editBtn from "../../assets/edit.png";
import deleteBtn from "../../assets/delete.png";
import { ChangeEvent, useEffect, useState } from "react";
import imgEditBtn from "../../assets/imgEditBtn.png";
import { useRouter } from "next/navigation";
import { queryClient } from "@/app/config/ReactQueryProvider";
import editCompleteBtn from "../../assets/edit-complete-btn.png";

// 할 일 상세 페이지
export default function Page({ params }: { params: { itemId: number } }) {
    const router = useRouter();
    const { itemId } = params;
    const [isEditing, setIsEditing] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [memo, setMemo] = useState("");
    const [isModified, setModified] = useState(false);
    // 할 일 상세 페이지의 할 일 불러오기
    const todoQuery = useQuery({
        queryKey: ["todo", itemId],
        queryFn: () => getTodo("ppinppini", itemId),
    });
    const todo = todoQuery?.data;
    console.log(todo);
    // 할 일을 삭제하기 함수
    const deleteTodoMutation = useMutation({
        mutationFn: () => deleteTodo("ppinppini", itemId),
        onSuccess: () => {
            router.push("/");
        },
    });
    // 할 일을 수정 후 할일 목록 페이지로 이동
    const editTodoMutation = useMutation({
        mutationFn: ({ id, memo, imageUrl }: { id: number; memo: string; imageUrl: string | null; isCompleted: boolean }) =>
            editTodo("ppinppini", id, {
                memo: memo !== null ? memo : todo?.memo || "",
                imageUrl: imageUrl !== null ? imageUrl : todo?.imageUrl || "",
                name: todo?.name || "",
                isCompleted: todo?.isCompleted || false,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            await todoQuery.refetch();
            router.push(`/`);
        },
        onError: () => alert("수정 실패!"),
    });

    // 이미지를 업로드 한 이미지의 URL을 받아오는 함수
    const uploadImageMutation = useMutation({
        mutationFn: (formData: FormData) => createImage("ppinppini", formData),
        onSuccess: (data) => {
            if (data && data.url) {
                setUploadedImageUrl(data.url);
            }
        },
    });
    // 이미지를 업로드 하는 함수
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!files || files.length === 0) return;

        const file = files[0];
        const formData = new FormData();
        formData.append("image", file);
        await uploadImageMutation.mutate(formData);
    };
    // 메모나 이미지의 상태 변경을 감지
    useEffect(() => {
        if (todo) {
            const isMemoModified = todo.memo !== memo;
            const isImageModified = todo.imageUrl !== uploadedImageUrl && uploadedImageUrl !== null;
            setModified(isMemoModified || isImageModified);
        }
    }, [memo, uploadedImageUrl]);

    return (
        <main className="mt-3 relative flex flex-col">
            <TodoItem {...todo} />
            <section className="flex flex-col gap-4 desktop:flex-row ">
                <div className="bg-[#F8FAFC] rounded-2xl h-[311px] desktop:w-1/2 flex items-center justify-center relative">
                    <Image
                        src={uploadedImageUrl ? uploadedImageUrl : todo?.imageUrl ? todo?.imageUrl : uploadImgBG}
                        alt="Uploaded Image"
                        layout="fill"
                        loading="lazy"
                        decoding="async"
                        className=" w-full rounded-2xl"
                    />
                    <input id="img-upload" type="file" onChange={handleImageChange} accept="image/jpg image/png image/jpeg" className="hidden" />
                    <label htmlFor="img-upload">
                        {todo?.imageUrl ? (
                            <Image src={imgEditBtn} alt="uploadBtn" className="absolute bottom-4 right-4 cursor-pointer" />
                        ) : (
                            <Image src={uploadImgBtn} alt="uploadBtn" className="absolute bottom-4 right-4 cursor-pointer" />
                        )}
                    </label>
                </div>
                <div className="h-[311px] bg-memo desktop:w-1/2 flex flex-col items-center justify-center py-4 rounded-2xl">
                    <h1 className="text-[#92400E] basis-1/12">Memo</h1>
                    {isEditing ? (
                        <textarea className="basis-11/12 bg-opacity-10 bg-transparent w-full placeholder:text-black" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder={todo.memo} />
                    ) : (
                        <p className="basis-11/12 bg-opacity-10 bg-transparent w-full placeholder:text-black" onClick={() => setIsEditing(!isEditing)}>
                            {todo?.memo}
                        </p>
                    )}
                </div>
            </section>
            <div className="flex desktop:justify-end gap-2 justify-center mt-4">
                {isModified ? (
                    <Image
                        src={editCompleteBtn}
                        alt="editBtn"
                        className=" cursor-pointer"
                        onClick={() => editTodoMutation.mutate({ id: todo.id, memo: memo, imageUrl: uploadedImageUrl, isCompleted: todo.isCompleted })}
                    />
                ) : (
                    <Image
                        src={editBtn}
                        alt="editBtn"
                        className=" cursor-pointer"
                        onClick={() => editTodoMutation.mutate({ id: todo.id, memo: memo, imageUrl: uploadedImageUrl, isCompleted: todo.isCompleted })}
                    />
                )}
                <Image src={deleteBtn} alt="deleteBtn" className="cursor-pointer" onClick={() => deleteTodoMutation.mutate()} />
            </div>
        </main>
    );
}
