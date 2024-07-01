FROM ubuntu:24.04

ARG ANGULAR_VERSION=18
ARG NODE_VERSION=20.9.0

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai


RUN  sed -i s@/archive.ubuntu.com/@/mirrors.bupt.edu.cn/@g /etc/apt/sources.list.d/ubuntu.sources \
     && apt update \
     && apt install -y nodejs npm curl wget git vim zsh \
     && apt autoclean \
     && apt autoremove

RUN npm config set registry https://registry.npmmirror.com  \
    && npm install -g n \
    && export N_NODE_MIRROR=https://npmmirror.com/mirrors/node \
    && n ${NODE_VERSION}

RUN corepack enable \
    && npm config set registry https://registry.npmmirror.com -g \
    && npm install --global @angular/cli@${ANGULAR_VERSION}

# oh-my-zsh
RUN wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh \
    && sed -i s@REPO=\${REPO:-ohmyzsh/ohmyzsh}@REPO=\${REPO:-mirrors/oh-my-zsh}@ \install.sh \
    && sed -i s@REMOTE=\${REMOTE:-https://github.com/\${REPO}.git}@REMOTE=\${REMOTE:-https://gitee.com/\${REPO}.git}@ \install.sh \
    && chmod +x install.sh \
    && ./install.sh -y

RUN ng config --global cli.packageManager pnpm
