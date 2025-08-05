import { Server, Socket } from "socket.io";

const projectUsers: {
  [projectId: string]: {
    id: string;
    username: string;
  }[];
} = {};

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    let currentProjectId: string | undefined;
    let currentUsername: string | undefined;

    socket.on("join", (data: { username: string; projectId: string }) => {
      const { username, projectId } = data;

      currentProjectId = projectId;
      currentUsername = username;
      socket.join(projectId);

      if (!projectUsers[projectId]) {
        projectUsers[projectId] = [];
      }

      const existingUserIndex = projectUsers[projectId].findIndex(
        (user) => user.username === username
      );

      if (existingUserIndex !== -1) {
        projectUsers[projectId][existingUserIndex].id = socket.id;
      } else {
        projectUsers[projectId].push({ id: socket.id, username });
      }

      io.to(projectId).emit("user-joined", {
        projectId,
        users: projectUsers[projectId],
      });
    });

    socket.on(
      "cursor-update",
      (data: {
        projectId: string;
        username: string;
        cursorPosition: number;
      }) => {
        const { projectId, username, cursorPosition } = data;

        socket.to(projectId).emit("cursor-update", {
          username,
          cursorPosition,
        });
      }
    );

    socket.on(
      "text-change",
      (data: { projectId: string; username: string; content: string }) => {
        const { projectId, username, content } = data;

        socket.to(projectId).emit("text-change", {
          username,
          content,
        });
      }
    );

    socket.on("disconnect", () => {
      if (
        currentProjectId &&
        currentUsername &&
        projectUsers[currentProjectId]
      ) {
        const userIndex = projectUsers[currentProjectId].findIndex(
          (user) => user.id === socket.id
        );

        if (userIndex !== -1) {
          const disconnectedUser = projectUsers[currentProjectId][userIndex];
          projectUsers[currentProjectId].splice(userIndex, 1);

          io.to(currentProjectId).emit("user-left", {
            projectId: currentProjectId,
            username: disconnectedUser.username,
            users: projectUsers[currentProjectId],
          });
        }
      }
    });
  });
};
