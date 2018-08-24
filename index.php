<?php

    $book_title = filter_input(INPUT_POST, "title");
    $book_isbn = filter_input(INPUT_POST, "isbn");

    $parent = filter_input(INPUT_POST, "parent");

    $fp = fopen("book.json", "r+");
    $json = json_decode(fread($fp, filesize("book.json")), true);
    fclose($fp);

    if ($book_title && $book_isbn) {
        $data = [];
        $data["id"] = md5($book_title . $book_isbn);
        $data["title"] = $book_title;
        $data["isbn"] = $book_isbn;

        $ids = array_map(
            function ($datum) {
                return $datum["id"];
            }, $json
        );
        if ($parent !== null && in_array($parent, $ids, true)) {
            $data["parent"] = $parent;
        }

        fopen("book.json", "w");
        fwrite($fp, json_encode(array_merge($json, $data)));
        fclose($fp);
    }
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>読んだ本を記録します</title>
</head>
<body>
<form method="post" action="">
    <p>
        <label>
            タイトル: <input type="text" name="title">
        </label>
    </p>
    <p>
        <label>
            ISBN: <input type="text" name="isbn">
        </label>
    </p>
    <p>
        <input type="submit">
    </p>
</form>

<table>
    <tr>
        <th>ID</th>
        <th>タイトル</th>
        <th>ISBN</th>
    </tr>
    <?php foreach ($json as $datum): ?>
        <tr>
            <td><?= $datum["id"] ?></td>
            <td><?= $datum["title"] ?></td>
            <td><?= $datum["isbn"] ?></td>
        </tr>
    <?php endforeach; ?>
</table>
</body>
</html>
