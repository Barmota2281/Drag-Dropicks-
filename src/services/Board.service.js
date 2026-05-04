/**
 * boardService.js
 * Полный слой работы с бэкендом для досок, колонок и задач.
 * Бэкенд: Spring Boot + Firebase Firestore
 * Все данные пользователя хранятся в Firestore, привязаны к UID через JWT.
 */
import api from '../api.js';

// ── Доски ────────────────────────────────────────────────────────────────────

/**
 * Загрузить все доски пользователя со всеми колонками и задачами.
 * Бэкенд возвращает плоский список досок через GET /boards,
 * затем для каждой доски запрашиваем GET /boards/{id} чтобы получить колонки и задачи.
 */
export async function fetchAllBoards() {
    const { data: boards } = await api.get('/boards');

    // Загружаем каждую доску полностью (с колонками и задачами)
    const fullBoards = await Promise.all(
        boards.map(board => fetchBoard(board.id))
    );

    return fullBoards;
}

/**
 * Загрузить одну доску полностью (колонки + задачи).
 * GET /boards/{boardId} возвращает { ...board, columns: [], tasks: [] }
 * Задачи приходят плоским массивом с полем columnId — раскладываем их по колонкам.
 */
export async function fetchBoard(boardId) {
    const { data } = await api.get(`/boards/${boardId}`);

    // tasks приходят плоско: [{ id, columnId, content, order, priority, deadline, ... }]
    // Нужно вложить их в соответствующие колонки
    const columns = (data.columns || []).map(col => ({
        ...col,
        color: col.color || '#9ca3af',
        tasks: (data.tasks || [])
            .filter(t => t.columnId === col.id)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(t => normalizeTask(t)),
    })).sort((a, b) => (a.order || 0) - (b.order || 0));

    return {
        id: data.id,
        title: data.title || 'Без названия',
        background: data.background || '#ffffff',
        ownerId: data.ownerId,
        members: data.members || [],
        columns,
    };
}

/**
 * Создать новую доску.
 * POST /boards — { title, template }
 * Бэкенд сам создаёт колонки по шаблону.
 */
export async function createBoard(title, template = 'Пустая доска') {
    const { data } = await api.post('/boards', { title, template });
    // После создания загружаем полную доску чтобы получить колонки
    return await fetchBoard(data.id);
}

/**
 * Обновить доску.
 * PUT /boards/{boardId}
 */
export async function updateBoard(boardId, updates) {
    const { data } = await api.put(`/boards/${boardId}`, updates);
    return data;
}

/**
 * Удалить доску.
 * DELETE /boards/{boardId}
 */
export async function deleteBoard(boardId) {
    await api.delete(`/boards/${boardId}`);
}

// ── Колонки ──────────────────────────────────────────────────────────────────

/**
 * Создать колонку.
 * POST /boards/{boardId}/columns — { title, color, order }
 */
export async function createColumn(boardId, title, color = '#9ca3af', order = 0) {
    const { data } = await api.post(`/boards/${boardId}/columns`, {
        title,
        color,
        order,
    });
    return { ...data, color: data.color || color, tasks: [] };
}

/**
 * Обновить колонку (название, цвет, порядок).
 * PUT /boards/{boardId}/columns/{columnId}
 */
export async function updateColumn(boardId, columnId, updates) {
    await api.put(`/boards/${boardId}/columns/${columnId}`, updates);
}

/**
 * Удалить колонку.
 * DELETE /boards/{boardId}/columns/{columnId}
 */
export async function deleteColumn(boardId, columnId) {
    await api.delete(`/boards/${boardId}/columns/${columnId}`);
}

// ── Задачи ───────────────────────────────────────────────────────────────────

/**
 * Создать задачу.
 * POST /boards/{boardId}/tasks — { columnId, content, order, priority, deadline, reminder }
 */
export async function createTask(boardId, columnId, order = 0) {
    const { data } = await api.post(`/boards/${boardId}/tasks`, {
        columnId,
        content: '<p>Новая задача...</p>',
        order,
        priority: null,
        deadline: null,
        reminder: false,
    });
    return normalizeTask(data);
}

/**
 * Обновить задачу (контент, приоритет, дедлайн, колонка, порядок).
 * PUT /boards/{boardId}/tasks/{taskId}
 */
export async function updateTask(boardId, taskId, updates) {
    // Убираем undefined поля
    const clean = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await api.put(`/boards/${boardId}/tasks/${taskId}`, clean);
}

/**
 * Переместить задачу в другую колонку или изменить порядок.
 * PUT /boards/{boardId}/tasks/{taskId} — { columnId, order }
 */
export async function moveTask(boardId, taskId, columnId, order) {
    await api.put(`/boards/${boardId}/tasks/${taskId}`, { columnId, order });
}

/**
 * Удалить задачу.
 * DELETE /boards/{boardId}/tasks/{taskId}
 */
export async function deleteTask(boardId, taskId) {
    await api.delete(`/boards/${boardId}/tasks/${taskId}`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Нормализовать объект задачи с бэкенда к формату фронтенда.
 * Бэкенд может возвращать deadline как null, пустую строку или дату.
 */
function normalizeTask(task) {
    return {
        id: task.id,
        columnId: task.columnId,
        content: task.content || '<p></p>',
        order: task.order || 0,
        priority: task.priority || null,
        deadline: task.deadline || null,
        reminder: task.reminder || false,
        recurrence: task.recurrence || 'none',
        assignee: task.assignee || null,
        createdAt: task.createdAt
            ? (Array.isArray(task.createdAt)
                ? new Date(task.createdAt[0], task.createdAt[1] - 1, task.createdAt[2], task.createdAt[3] || 0, task.createdAt[4] || 0, task.createdAt[5] || 0).getTime()
                : (typeof task.createdAt === 'object' && task.createdAt._seconds ? task.createdAt._seconds * 1000 : task.createdAt))
            : Date.now(),
        // editor будет добавлен на фронте через createEditor()
    };
}