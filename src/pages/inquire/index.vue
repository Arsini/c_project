<script>
export default {
    data(){
        const prefix = '/inquire/';
        return{
            nav: [
                {
                    name: '投注记录',
                    link: `${prefix}inquire_betting`,
                },
                {
                    name: '优惠记录',
                    link: `${prefix}inquire_reward`,
                },
                {
                    name: '充值记录',
                    link: `${prefix}inquire_recharge`,
                },
                {
                    name: '提款记录',
                    link: `${prefix}inquire_withdraw`,
                },
            ]
        }
    },
}
</script>

<template>
    <div class="inquire">
        <ul class="tab">
            <router-link
            v-for="item in nav"
            :key="item.name"
            :to="item.link"
            tag="li">{{ item.name }}</router-link>
        </ul>
        <router-view/>
    </div>
</template>

<style lang="postcss">
    .inquire{
        .search{
            background-color: #171717;
            margin-bottom: 10px;
        }
        .prefix{
            display: flex;
            white-space: nowrap;
            position: relative;
            z-index: 2;
            padding: 0.4rem 4% 0 4%;
            label{
                border-radius: 4px 0px 0px 4px;
                padding-left: 20px;
                padding-right: 20px;
                line-height: 65px;
                background-color: #ffaa0d;
                color:#6b4500;
            }
            input,select{
                padding-left: 10px;
                flex: 1;
            }
            input{
                color: #333333;
                border-radius: 0 4px 4px 0;
                background-color: #f7f7f7;
                border: none;
                outline: none;
                -webkit-appearance: none;
            }
            select{
                color: #333333;
                border-radius: 0 4px 4px 0;
                background-color: #f7f7f7;
                border: none;
                outline: none;
                -webkit-appearance: none;
                
            }
        }
        .tip{
            margin-top: 10px;
            padding: 0 4%;
            text-align: right;
            color:#ff3c3c;
        }
        .cancelBtn{
            background-color: #df3232;
            color: #fff;
            padding: 0.1rem 0.15rem;
            border-radius: 2px;
        }
        .field{
            padding: 6px 4%;
            .time{
                color: #a9a8a8;
                margin-top: 0.1rem;
            }
            text-align: left;
        }
        .amount{
            color: red;
        }

    }
</style>

