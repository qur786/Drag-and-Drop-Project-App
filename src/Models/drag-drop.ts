// Drag and Drop interfaces
export interface Draggable {
    DragStartHandler(event: DragEvent): void;
    DragEndHandler(event: DragEvent): void;
}

export interface DropTarget {
    DragOverHandler(event: DragEvent): void;
    DropHandler(event: DragEvent): void;
    DragLeaveHandler(event: DragEvent): void;
}