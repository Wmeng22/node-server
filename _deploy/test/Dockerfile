FROM 192.168.0.1:23280/common/frontend:1.0.0

RUN mkdir -p /workspace/build && mkdir -p /workspace/run

COPY . /workspace/build

# 修改npm指令
RUN cd /workspace/build && \
    cp -r /workspace/build/* /workspace/run && \
    rm -rf /workspace/build && \
    cd /workspace/run && \
    cnpm install

CMD cd /workspace/run && npm run start


