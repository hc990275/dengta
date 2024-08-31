// ==UserScript==
// @name         美化灯塔视频加速自动播放及自动学习
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动播放灯塔干部网络学院的视频内容，支持加速、减速、恢复默认速度按钮，显示视频总时长、当前时间和剩余时间。看完视频后自动返回上一页面并查找未学习视频进行播放。界面美化版本。
// @author
// @match        https://gbwlxy.dtdjzx.gov.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板
    let controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.left = '10px';
    controlPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    controlPanel.style.color = '#333';
    controlPanel.style.padding = '15px';
    controlPanel.style.borderRadius = '12px';
    controlPanel.style.fontFamily = 'Arial, sans-serif';
    controlPanel.style.zIndex = 9999;
    controlPanel.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    controlPanel.style.width = '220px';

    // 创建加速、减速、恢复默认按钮
    let speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.min = 0.1;
    speedInput.max = 16;
    speedInput.step = 0.1;
    speedInput.value = 3; // 默认值为3倍速
    speedInput.style.marginBottom = '12px';
    speedInput.title = "输入播放速度";
    speedInput.style.width = '100%';
    speedInput.style.padding = '8px';
    speedInput.style.borderRadius = '8px';
    speedInput.style.border = '1px solid #ccc';
    speedInput.style.boxSizing = 'border-box';

    // 创建选择加减速步长的选项
    let speedStepLabel = document.createElement('div');
    speedStepLabel.textContent = '选择加减速步长:';
    speedStepLabel.style.marginBottom = '8px';
    speedStepLabel.style.fontSize = '14px';
    speedStepLabel.style.color = '#555';

    let stepContainer = document.createElement('div');
    stepContainer.style.display = 'flex';
    stepContainer.style.justifyContent = 'space-between';
    stepContainer.style.marginBottom = '12px';

    let stepOption1Label = document.createElement('label');
    stepOption1Label.textContent = '0.1';
    stepOption1Label.style.flex = '1';
    stepOption1Label.style.textAlign = 'center';

    let stepOption1 = document.createElement('input');
    stepOption1.type = 'radio';
    stepOption1.name = 'speedStep';
    stepOption1.value = '0.1';
    stepOption1.checked = true;
    stepOption1Label.style.display = 'flex';
    stepOption1Label.style.alignItems = 'center';
    stepOption1Label.style.justifyContent = 'center';
    stepOption1Label.style.padding = '6px';
    stepOption1Label.style.borderRadius = '8px';
    stepOption1Label.style.backgroundColor = '#e0e0e0';
    stepOption1Label.style.margin = '0 5px';
    stepOption1Label.style.cursor = 'pointer';
    stepOption1Label.prepend(stepOption1);

    let stepOption2Label = document.createElement('label');
    stepOption2Label.textContent = '1';
    stepOption2Label.style.flex = '1';
    stepOption2Label.style.textAlign = 'center';

    let stepOption2 = document.createElement('input');
    stepOption2.type = 'radio';
    stepOption2.name = 'speedStep';
    stepOption2.value = '1';
    stepOption2Label.style.display = 'flex';
    stepOption2Label.style.alignItems = 'center';
    stepOption2Label.style.justifyContent = 'center';
    stepOption2Label.style.padding = '6px';
    stepOption2Label.style.borderRadius = '8px';
    stepOption2Label.style.backgroundColor = '#e0e0e0';
    stepOption2Label.style.margin = '0 5px';
    stepOption2Label.style.cursor = 'pointer';
    stepOption2Label.prepend(stepOption2);

    stepContainer.appendChild(stepOption1Label);
    stepContainer.appendChild(stepOption2Label);

    controlPanel.appendChild(speedStepLabel);
    controlPanel.appendChild(stepContainer);

    let increaseSpeedBtn = document.createElement('button');
    increaseSpeedBtn.textContent = '加速';
    increaseSpeedBtn.style.marginRight = '6px';
    increaseSpeedBtn.style.backgroundColor = '#4caf50';
    increaseSpeedBtn.style.border = 'none';
    increaseSpeedBtn.style.color = 'white';
    increaseSpeedBtn.style.padding = '10px';
    increaseSpeedBtn.style.borderRadius = '8px';
    increaseSpeedBtn.style.cursor = 'pointer';
    increaseSpeedBtn.style.width = '48%';

    let decreaseSpeedBtn = document.createElement('button');
    decreaseSpeedBtn.textContent = '减速';
    decreaseSpeedBtn.style.backgroundColor = '#f44336';
    decreaseSpeedBtn.style.border = 'none';
    decreaseSpeedBtn.style.color = 'white';
    decreaseSpeedBtn.style.padding = '10px';
    decreaseSpeedBtn.style.borderRadius = '8px';
    decreaseSpeedBtn.style.cursor = 'pointer';
    decreaseSpeedBtn.style.width = '48%';

    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';

    let resetSpeedBtn = document.createElement('button');
    resetSpeedBtn.textContent = '恢复默认';
    resetSpeedBtn.style.backgroundColor = '#2196f3';
    resetSpeedBtn.style.border = 'none';
    resetSpeedBtn.style.color = 'white';
    resetSpeedBtn.style.padding = '10px';
    resetSpeedBtn.style.borderRadius = '8px';
    resetSpeedBtn.style.cursor = 'pointer';
    resetSpeedBtn.style.marginTop = '12px';
    resetSpeedBtn.style.width = '100%';

    buttonContainer.appendChild(increaseSpeedBtn);
    buttonContainer.appendChild(decreaseSpeedBtn);

    controlPanel.appendChild(speedInput);
    controlPanel.appendChild(buttonContainer);
    controlPanel.appendChild(resetSpeedBtn);
    document.body.appendChild(controlPanel);

    // 创建时间显示框
    let timeDisplay = document.createElement('div');
    timeDisplay.style.position = 'fixed';
    timeDisplay.style.top = '260px';  // 调整时间显示框的位置
    timeDisplay.style.left = '10px';  // 左侧对齐
    timeDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    timeDisplay.style.color = '#333';
    timeDisplay.style.padding = '15px';
    timeDisplay.style.borderRadius = '12px';
    timeDisplay.style.zIndex = 9999;
    timeDisplay.style.fontFamily = 'Arial, sans-serif';
    timeDisplay.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    timeDisplay.style.width = '220px';

    document.body.appendChild(timeDisplay);

    // 创建进度条
    let progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.bottom = '0px';
    progressBar.style.left = '0px';
    progressBar.style.width = '0%';
    progressBar.style.height = '6px';
    progressBar.style.backgroundColor = '#4caf50';
    progressBar.style.zIndex = 9999;
    progressBar.style.transition = 'width 0.5s';

    document.body.appendChild(progressBar);

    // 将秒数转换为时:分:秒格式
    function formatTime(seconds) {
        let h = Math.floor(seconds / 3600);
        let m = Math.floor((seconds % 3600) / 60);
        let s = Math.floor(seconds % 60);
        return `${h}小时 ${m}分钟 ${s}秒`;
    }

    // 自动播放视频并设置初始播放速度
    function autoPlayVideo() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;  // 静音播放
            video.play();
            console.log("视频已自动播放，并设置播放速度为" + speedInput.value + "倍速");
            video.playbackRate = parseFloat(speedInput.value);

            // 定期更新视频时间信息和进度条
            setInterval(function() {
                let currentTime = video.currentTime;
                let duration = video.duration;
                let remainingTime = duration - currentTime;

                // 更新时间显示
                timeDisplay.innerHTML = `视频总时长: ${formatTime(duration)}<br>播放时间: ${formatTime(currentTime)}<br>剩余时间: ${formatTime(remainingTime)}`;

                // 更新进度条
                progressBar.style.width = `${(currentTime / duration) * 100}%`;

            }, 500);

            // 防止视频暂停
            video.addEventListener('pause', function(){
                console.log('视频暂停，继续播放...');
                video.play();
            });

            // 视频结束后返回上一页面并查找未学习视频
            video.addEventListener('ended', function(){
                console.log('视频结束...');
                setTimeout(() => {
                    findNextUnwatchedVideo(); // 查找下一个未学习的视频
                }, 3000);
            });

        } else {
            console.log("未找到视频元素");
            setTimeout(autoPlayVideo, 1000); // 每秒检查一次，直到找到视频元素
        }
    }

    // 查找下一个未学习的视频
    function findNextUnwatchedVideo() {
        console.log('查找下一个未学习的视频...');
        window.history.back(); // 返回上一页面

        // 在上一页面加载完成后执行查找
        window.addEventListener('popstate', function() {
            setTimeout(() => {
                let videos = document.querySelectorAll('.video-list-item'); // 根据实际情况调整选择器
                for (let video of videos) {
                    if (video.textContent.includes('未学习')) { // 根据实际情况调整判断条件
                        console.log('找到未学习的视频，开始播放...');
                        video.click(); // 点击未学习的视频
                        setTimeout(autoPlayVideo, 2000); // 延迟一段时间后开始播放视频
                        return;
                    }
                }
                console.log('未找到未学习的视频。');
            }, 2000);
        });
    }

    autoPlayVideo(); // 尝试自动播放视频

    // 监听速度输入框的变化
    speedInput.addEventListener('change', function() {
        let video = document.querySelector('video');
        if (video) {
            video.playbackRate = parseFloat(speedInput.value);
            console.log("视频播放速度已设置为" + speedInput.value + "倍速");
        }
    });

    // 加速按钮点击事件
    increaseSpeedBtn.addEventListener('click', function() {
        let video = document.querySelector('video');
        if (video) {
            let step = parseFloat(document.querySelector('input[name="speedStep"]:checked').value);
            speedInput.value = Math.min(parseFloat(speedInput.value) + step, 16).toFixed(1);
            video.playbackRate = parseFloat(speedInput.value);
            console.log("视频播放速度增加至" + speedInput.value + "倍速");
        }
    });

    // 减速按钮点击事件
    decreaseSpeedBtn.addEventListener('click', function() {
        let video = document.querySelector('video');
        if (video) {
            let step = parseFloat(document.querySelector('input[name="speedStep"]:checked').value);
            speedInput.value = Math.max(parseFloat(speedInput.value) - step, 0.1).toFixed(1);
            video.playbackRate = parseFloat(speedInput.value);
            console.log("视频播放速度减少至" + speedInput.value + "倍速");
        }
    });

    // 恢复默认速度按钮点击事件
    resetSpeedBtn.addEventListener('click', function() {
        let video = document.querySelector('video');
        if (video) {
            speedInput.value = 1;
            video.playbackRate = 1;
            console.log("视频播放速度已恢复到默认的1倍速");
        }
    });

    // 自动学习功能
    function xq() {
        console.log('学习中...');
        showMsg('准备学习......');
        var video = document.querySelector('video');
        //确保成功
        if (!video) {
            setTimeout(xq, 2000);
            return;
        }
        video.muted = true; // 自动播放需静音
        video.play();
        showMsg('学习中......');
    }

    xq(); // 开始学习

})();
