class Todo {
  final String id;
  final String title;
  final bool completed;
  final DateTime assignedAt;
  final DateTime? completedAt;

  Todo({
    required this.id,
    required this.title,
    required this.completed,
    required this.assignedAt,
    this.completedAt,
  });

  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['_id'],
      title: json['title'],
      completed: json['completed'] ?? false,
      assignedAt: DateTime.parse(json['assignedAt']),
      completedAt: json['completedAt'] != null ? DateTime.parse(json['completedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'completed': completed,
    };
  }
}
