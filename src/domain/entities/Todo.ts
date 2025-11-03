export interface Todo { id: string;
title: string; 
completed: boolean; 
createdAt: Date;
userId: string; // ← NUEVO: ID del usuario dueño de esta tarea
}

export interface CreateTodoDTO { 
title: string;
userId: string; // ← NUEVO: Requerido al crear una tarea
}

export interface UpdateTodoDTO { 
id: string;
completed?: boolean; 
title?: string; // userId NO es editable (no queremos cambiar el dueño)
}
