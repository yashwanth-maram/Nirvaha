import { motion } from 'motion/react';
import { Cloud, Moon, Zap, Activity, Users, Flame, ChevronRight } from 'lucide-react';

export const CommonProblems = () => {
    const problems = [
        { title: "Burnout", icon: Flame, color: "text-orange-500" },
        { title: "Excess Stress", icon: Zap, color: "text-yellow-500" },
        { title: "Sleep Issues", icon: Moon, color: "text-purple-500" },
        { title: "High Anxiety", icon: Cloud, color: "text-blue-500" },
        { title: "Mood Swings", icon: Activity, color: "text-pink-500" },
        { title: "Feeling Isolated", icon: Users, color: "text-teal-500" },
    ];

    return (
        <section className="py-8 bg-white relative">
            <div className="w-full px-6 md:px-12 lg:px-20">
                <div className="text-center mb-8">
                    <motion.h2
                        className="text-2xl md:text-3xl font-bold text-[#0F131A] mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Most Common Problems
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {problems.map((p, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer"
                        >
                            <span className="text-lg font-medium text-gray-900 group-hover:text-[#1a5d47] transition-colors">
                                {p.title}
                            </span>

                            <div className="flex items-center gap-4">
                                <p.icon className={`w-6 h-6 ${p.color}`} />
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1a5d47] transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
