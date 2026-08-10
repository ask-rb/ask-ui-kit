import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export type TodoStatus = "pending" | "in_progress" | "completed" | "blocked";

export interface TodoItem {
  id: string;
  title: string;
  status: TodoStatus;
}

/**
 * AskTodoList — the agent's live todo list (todo_write tool).
 *
 *   <ask-todo-list .todos=${[{id: "1", title: "Write tests", status: "in_progress"}]}></ask-todo-list>
 *
 * The `todos` property accepts an array of {id, title, status} objects, or
 * an array of strings (treated as pending items).
 */
export class AskTodoList extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .todos {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .todo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--ask-border-strong, #404040);
      background: var(--ask-surface-muted, #fafafa);
      border: 1px solid var(--ask-border, #e5e5e5);
    }

    .todo .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 999px;
      flex-shrink: 0;
      background: var(--ask-text-muted, #a3a3a3);
    }
    .todo--in_progress .dot { background: var(--ask-accent, #c2410c); animation: todo-pulse 1.2s ease-in-out infinite; }
    .todo--completed .dot { background: #16a34a; }
    .todo--blocked .dot { background: var(--ask-danger, #dc2626); }

    .todo .title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .todo--completed .title { text-decoration: line-through; color: var(--ask-text-muted, #a3a3a3); }

    .todo .status {
      margin-left: auto;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--ask-text-muted, #a3a3a3);
      flex-shrink: 0;
    }

    @keyframes todo-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }
  `;

  @property({ type: Array }) todos: TodoItem[] | string[] = [];

  render() {
    if (this.todos.length === 0) return html``;
    const items = this.todos.map((t): TodoItem =>
      typeof t === "string" ? { id: t, title: t, status: "pending" } : t
    );

    return html`
      <ul class="todos">
        ${items.map((t) => html`
          <li class="todo todo--${t.status}">
            <span class="dot"></span>
            <span class="title">${t.title}</span>
            <span class="status">${t.status.replace("_", " ")}</span>
          </li>
        `)}
      </ul>`;
  }
}

customElements.define("ask-todo-list", AskTodoList);
