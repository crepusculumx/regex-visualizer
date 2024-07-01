#!/bin/bash

SCRIPT_ACTION=$1
shift

readonly PROJECT_NAME=regex-visualizer

readonly CONTAINER_NAME=${PROJECT_NAME}-dev

readonly IMAGE_NAME=angular
readonly IMAGE_TAG=18-node-20.9.0

readonly CONTAINER_FILE=dev.dockerfile

readonly SHELL=zsh

readonly VOLUME_PATH=/code/${PROJECT_NAME}

# 容器编号
# warning：容器名不能是另一个容器名的前缀
CONTAINER_ID=$(podman ps -aqf name="${CONTAINER_NAME}")

function container_action_start() {
  local CONTAINER_ID=$1
  shift
  podman start "${CONTAINER_ID}"
}

function container_action_stop() {
  local CONTAINER_ID=$1
  shift
  podman stop "${CONTAINER_ID}"
}

function container_action_shell() {
  local CONTAINER_ID=$1
  shift
  podman exec -it "${CONTAINER_ID}" /bin/${SHELL}
}

# 如果没有容器，创建个新的
if [ -z "${CONTAINER_ID}" ]; then

  # 如果没有镜像
  IMAGE_ID=$(podman images -q "${IMAGE_NAME}:${IMAGE_TAG}")
  if [ -z "${IMAGE_ID}" ]; then
    podman build -t "${IMAGE_NAME}:${IMAGE_TAG}" -f ${CONTAINER_FILE} .
  fi

  podman run \
    -itd \
    --net="host" \
    --name="${CONTAINER_NAME}" \
    --volume="${PWD}:${VOLUME_PATH}" \
    "${IMAGE_NAME}:${IMAGE_TAG}" /bin/${SHELL}

  # 建好了先关闭，之后统一管理
  CONTAINER_ID=$(podman ps -qf "name=${CONTAINER_NAME}")
  container_action_stop "${CONTAINER_ID}"
fi

# 确定目前容器状态
CONTAINER_RUN_ID=$(podman ps -qf "name=${CONTAINER_NAME}")
CUR_STATE=

if [ -z "${CONTAINER_RUN_ID}" ]; then
  CUR_STATE=stop
else
  CUR_STATE=run
fi

# 默认为start
if [ -z "${SCRIPT_ACTION}" ]; then
  SCRIPT_ACTION=start
fi

# 根据SCRIPT_ACTION启动或关闭
case ${SCRIPT_ACTION} in
start)
  if [ $CUR_STATE == stop ]; then
    container_action_start "${CONTAINER_ID}"
  fi
  ;;
shell)
  if [ $CUR_STATE == stop ]; then
    container_action_start "${CONTAINER_ID}"
  fi
  container_action_shell "${CONTAINER_ID}"
  ;;
stop)
  if [ $CUR_STATE == run ]; then
    container_action_stop "${CONTAINER_ID}"
  fi
  ;;
*)
  echo invalid action: "${SCRIPT_ACTION}" 1>&2
  exit 1
  ;;
esac
