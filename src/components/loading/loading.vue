<script>
export default {
    props: [
        'isShow',//是否显示
        'type',//defult: 局部； winddow: 全屏；
    ],
    data(){
        return{
            
        }
    }
}
</script>


<template>
    <transition name="fade">
        <div class="loading" v-show="isShow">
            <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>
            <p class="loading_text">正在加载...</p>
        </div>
    </transition>
</template>

<style lang="postcss">
    .loading {
        background: rgba(0, 0, 0, .8);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .loading_text {
            font-size: 14px;
            color: #fff;
            text-align: center;
            position: fixed;
            top: 59%;
            left: 0;
            right: 0;
        }
    }
    /* 动效部分 */
    .sk-folding-cube {
        opacity: 1;
        margin: auto;
        width: 50px;
        height: 50px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-transform: rotateZ(45deg);
        transform: rotateZ(45deg);
    }

    .sk-folding-cube .sk-cube {
        float: left;
        width: 50%;
        height: 50%;
        position: relative;
        -webkit-transform: scale(1.1);
        -ms-transform: scale(1.1);
        transform: scale(1.1);
    }

    .sk-folding-cube .sk-cube:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #ffc458;
        -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
        animation: sk-foldCubeAngle 2.4s infinite linear both;
        -webkit-transform-origin: 100% 100%;
        -ms-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }

    .sk-folding-cube .sk-cube2 {
        -webkit-transform: scale(1.1) rotateZ(90deg);
        transform: scale(1.1) rotateZ(90deg);
    }

    .sk-folding-cube .sk-cube3 {
        -webkit-transform: scale(1.1) rotateZ(180deg);
        transform: scale(1.1) rotateZ(180deg);
    }

    .sk-folding-cube .sk-cube4 {
        -webkit-transform: scale(1.1) rotateZ(270deg);
        transform: scale(1.1) rotateZ(270deg);
    }

    .sk-folding-cube .sk-cube2:before {
        background: #ffaa0d;
        -webkit-animation-delay: 0.3s;
        animation-delay: 0.3s;
    }

    .sk-folding-cube .sk-cube3:before {
        background: #ffc458;
        -webkit-animation-delay: 0.6s;
        animation-delay: 0.6s;
    }

    .sk-folding-cube .sk-cube4:before {
        background: #ffaa0d;
        -webkit-animation-delay: 0.9s;
        animation-delay: 0.9s;
    }

    @-webkit-keyframes sk-foldCubeAngle {

        0%,
        10% {
            -webkit-transform: perspective(140px) rotateX(-180deg);
            transform: perspective(140px) rotateX(-180deg);
            opacity: 0;
        }

        25%,
        75% {
            -webkit-transform: perspective(140px) rotateX(0deg);
            transform: perspective(140px) rotateX(0deg);
            opacity: 1;
        }

        90%,
        100% {
            -webkit-transform: perspective(140px) rotateY(180deg);
            transform: perspective(140px) rotateY(180deg);
            opacity: 0;
        }
    }

    @keyframes sk-foldCubeAngle {

        0%,
        10% {
            -webkit-transform: perspective(140px) rotateX(-180deg);
            transform: perspective(140px) rotateX(-180deg);
            opacity: 0;
        }

        25%,
        75% {
            -webkit-transform: perspective(140px) rotateX(0deg);
            transform: perspective(140px) rotateX(0deg);
            opacity: 1;
        }

        90%,
        100% {
            -webkit-transform: perspective(140px) rotateY(180deg);
            transform: perspective(140px) rotateY(180deg);
            opacity: 0;
        }
    }
</style>

