import os

def collect_code_to_txt(root_folder, output_file):
    # Extensions we care about
    extensions = [".jsx", ".ts"]

    with open(output_file, "w", encoding="utf-8") as outfile:
        for subdir, _, files in os.walk(root_folder):
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    file_path = os.path.join(subdir, file)

                    try:
                        with open(file_path, "r", encoding="utf-8") as infile:
                            content = infile.read()

                        # Collect metadata
                        rel_path = os.path.relpath(file_path, root_folder)
                        size = os.path.getsize(file_path)

                        # Write metadata + content to output file
                        outfile.write("========== FILE START ==========\n")
                        outfile.write(f"📄 File: {rel_path}\n")
                        outfile.write(f"📏 Size: {size} bytes\n")
                        outfile.write("========== CODE ==========\n")
                        outfile.write(content + "\n")
                        outfile.write("========== FILE END ==========\n\n\n")

                    except Exception as e:
                        print(f"⚠️ Could not read {file_path}: {e}")

    print(f"✅ Code collected into {output_file}")


if __name__ == "__main__":
    # Change this to your root folder
    project_folder = "src/service"
    output_txt = "all_code_with_metadata.txt"

    collect_code_to_txt(project_folder, output_txt)
